class Actions {
    constructor(managers) {
        this.managers = managers;
    }

    // -------------------------
    // Turn Management
    // -------------------------------

    async nextTurn(scene, states) {
        scene.active = this._getNext(scene.beasts);
        scene.active.resetTurn();
        scene.ui.updateTurns(this._getTurns(scene.beasts), scene.active);
        scene.camera.toLocation(scene.active.location, 750, 'ease-out');
        await scene.ui.nextTurn(scene.active);

        return Promise.resolve((scene.active.ai) ? states.AI_TURN : states.PLAYER_TURN);
    }

    _getNext(beasts) {
        let next = beasts.find(beast => beast.energy >= 100);

        while (next === undefined) {
            const ready = beasts.filter(beast => {
                if (beast.isAlive()) {
                    beast.energy += beast.stats.current.speed;
                    return beast.energy >= 100;
                }
                return false;
            }).sort((a, b) => b.energy - a.energy);

            next = ready[0];
        }
        next.energy -= 100;

        return next;
    }

    _getTurns(beasts, amount = 7) {
        let counter = 0;

        const turns = new Array();
        while (turns.length < amount) {
            const available = beasts.filter(beast => {
                const energy = beast.energy + (beast.stats.current.speed * counter),
                      isReady = energy >= 100,
                      isNewlyReady = Math.floor(energy / 100) > Math.floor((energy - (beast.stats.current.speed * 1)) / 100);

                return beast.isAlive() && isReady && isNewlyReady;
            }).sort((a, b) => ((b.energy + b.stats.current.speed * counter) % 100) - ((a.energy + a.stats.current.speed * counter) % 100));

            counter += 1;
            turns.push(...available);
        }

        return turns.slice(0, amount);
    }

    // ------------------------
    // Player Actions
    // -----------------------------

    async requestMove(scene, states) {
        scene.markers.range = BeastLogic.getRange(scene.active, scene.beasts, scene.map);
        scene.ui.requestMove();

        return Promise.resolve(states.MOVE_REQUEST);
    }

    async cancelRequestMove(scene, states) {
        scene.markers.clear();
        scene.ui.cancelRequestMove();

        return Promise.resolve(states.PLAYER_TURN);
    }

    async confirmMove(scene, states, target) {
        scene.state = states.MOVE_CONFIRM;

        const listenerID = Events.listen('move-step', (data, id) => {
            scene.ui._updateHeight(data.animation.destination.z);
            scene.map.removePointOfInterest(data.previous);
            scene.map.addPointOfInterest(data.animation.destination);
        }, true);

        const path = BeastLogic.getPath(target, scene.markers.range);
        scene.markers.range = null;

        return this.move(scene.active, path).then(data => {
            scene.markers.clear();

            scene.ui.confirmMove(scene.active.getRemainingMovement());
            scene.ui._updateHeight(scene.active.location.z);
            scene.map.removePointOfInterest(data.previous);
            scene.map.addPointOfInterest(data.animation.destination);

            Events.remove('move-step', listenerID);
            return states.PLAYER_TURN;
        });
    }

    async resetMove(scene, states) {
        scene.map.removePointOfInterest(scene.active.location);

        scene.active.animate(Object.assign(scene.active.animations.checkpoint, { ms: 0, frame: 0 }), true);
        scene.active.location = scene.active.animations.checkpoint.destination;
        scene.active.orientation = scene.active.animations.checkpoint.orientation;
        scene.active.animations.checkpoint = null;
        scene.active.traveled.total -= scene.active.traveled.last;
        scene.active.traveled.last = 0;

        scene.map.addPointOfInterest(scene.active.location)
        scene.ui.resetMove(scene.active);

        return this.requestMove(scene, states);
    }

    async requestAttack(scene, states, id) {
        scene.markers.range = SkillLogic.getRange(this.managers.skills.get(id), scene.active, scene.beasts, scene.map);
        scene.ui.requestAttack();

        return Promise.resolve(states.ATTACK_REQUEST);
    }

    async cancelRequestAttack(scene, states) {
        scene.markers.clear();
        scene.ui.cancelAttack();

        return Promise.resolve(states.PLAYER_TURN);
    }

    async confirmAttack(scene, states, id, target) {
        scene.state = states.ATTACK_CONFIRM;

        scene.markers.clear();
        await this.useSkill(id, scene.active, target, scene);
        scene.ui.cancelAttack();

        return Promise.resolve(states.PLAYER_TURN);
    }

    async requestWait(scene, states) {
        scene.markers.orientation = scene.active.orientation;

        return Promise.resolve(states.WAIT_REQUEST);
    }

    async cancelRequestWait(scene, states) {
        scene.markers.clear();
        return Promise.resolve(states.PLAYER_TURN);
    }

    async confirmWait(scene, states) {
        scene.state = states.WAIT_CONFIRM;
        scene.markers.clear();
        await scene.ui.endTurn();

        return this.nextTurn(scene, states);
    }

    // ----------------------------
    // Unit Actions
    // ---------------------------------

    async changeOrientation(unit, arg1, arg2) {
        let direction = arg1;
        if (direction instanceof Location)
            direction = CombatLogic.getOrientation(unit.location, direction);
        if (typeof direction === 'number')
            direction = CombatLogic.getOrientationToCoords(unit, arg1, arg2);

        if (unit.orientation !== direction) {
            unit.orientation = direction;
            const animation = BeastLogic.getDefaultAnimation(unit, unit.animation);
            animation.frame = unit.animations.current.frame;
            animation.ms = unit.animations.current.ms;
            unit.animate(animation, true);
        }

        return Promise.resolve(direction);
    }

    async move(unit, path, animationId = null) {
        const origin = unit.location,
              destination = path[path.length - 1],
              distance = Math.abs(destination.x - origin.x) + Math.abs(destination.y - origin.y);

        const complete = (resolve) => {
            Events.listen('move-complete', (data, id) => {
                if (data.unit !== unit)
                    return;
                Events.remove('move-complete', id);
                resolve(data);
            }, true);
        };

        unit.traveled.last += distance;
        unit.traveled.total += distance;
        unit.animate(BeastLogic.getMovementAnimations(unit, path, destination, animationId));

        return new Promise(complete);
    }

    async useSkill(id, attacker, target, scene) {
        console.log('----------- START ----------', id);
        const config = this.managers.skills.get(id),
              range = SkillLogic.getRange(config, attacker, scene.beasts, scene.map),
              selection = SkillLogic.getSelection(config, target, scene.beasts, scene.map, (config.target.overflow ? null : range)),
              secondary = scene.beasts.filter(beast => selection.has(beast.location)),
              primary = secondary.find(beast => beast.location === target);

        if (!range.has(target))
            return Promise.resolve();

        // -----------------
        // Calculate Damage / Crit
        // ----------------------

        // -------------------
        // Animation Sequence
        // -------------------------------

        await this.changeOrientation(attacker, target);

        for (let i = 0; i < config.sequence.length; i++)
            await this._doSegment(config, i, attacker, primary, secondary, target, selection, scene);

        console.log('----------- END ------------', id);
        return Promise.resolve();
    }

    // ----------------------------
    // Helper Functions
    // ---------------------------------

    async _doSegment(config, index, attacker, primary, secondary, target, selection, scene) {
        switch (config.sequence[index].category) {
            case 'animation':
                return this._prepareAnimationSegment(config.sequence[index], attacker, primary, secondary, target, selection, scene);
            case 'damage':
                return this._doDamageSegment(config.sequence[index], config.power, attacker, primary, secondary, target, selection, scene);
            case 'filter':
                return this._doFilterSegment(config.sequence[index], attacker, primary, secondary, target, selection, scene);
            case 'effect':
                return this._doEffectSegment(config.sequence[index], attacker, primary, secondary, target, selection, scene);
            case 'sound':
                return this._doSoundSegment(config.sequence[index], attacker, primary, secondary, target, selection, scene);
            case 'camera':
                return this._doCameraSegment(config.sequence[index], attacker, primary, secondary, target, selection, scene);
            case 'wait':
                return this._doWaitSegment(config.sequence[index], attacker, primary, secondary, target, selection, scene);
        }
    }

    _getAffected(identifier, attacker, primary, secondary) {
        const subjects = new Array();
        if (identifier === 'self')
            subjects.push(attacker);
        if (primary !== undefined  && ['primary',   'all'].includes(identifier))
            subjects.push(primary);
        if (secondary.length !== 0 && ['secondary', 'all'].includes(identifier))
            subjects.push(...secondary);
        return subjects;
    }

    // ------------------------------------------------------
    // ------------ Animation Segment <Object> --------------
    // ------------------------------------------------------
    // category: 'animation', // ['animation', 'filter', 'damage', 'wait']
    // type: 'beast',         // ['beast', 'tile', 'decoration']
    // on: 'self',            // ['self', 'primary', 'secondary', 'all']
    // animations: [
    //     { id: 'brace' },
    //     {   // example of dashing to tile next to target
    //         id: 'dash', 
    //         movement: true,                // move
    //         destination: 'primary',        // to destination ['self', 'attacker', 'primary', 'target']
    //         offset: -1,                    // with this tile offset
    //         orientation: 'to-destination', // based on the orientation of ['self', 'attacker', 'primary', 'to-destination']
    //     },
    //     { id: 'slash' }
    // ],
    // wait: 'hit'
    // -------------------------------------------------------------------------------------------------


    _prepareAnimationSegment(segment, attacker, primary, secondary, target, selection, scene) {
        if (segment.type === 'beast') {
            const subjects = this._getAffected(segment.on, attacker, primary, secondary)

            if (subjects.length > 0)
                return this._prepareBeastAnimationSegment(subjects, segment.animations, segment.wait, attacker, primary, secondary, target, selection, scene);
        }

        return Promise.resolve();
    }

    _prepareBeastAnimationSegment(subjects, animations, event, attacker, primary, secondary, target, selection, scene) {
        const pending = new Array();

        subjects.forEach(beast => {
            animations.forEach(animation => {
                const config = new Object();
                config.beast = beast;
                config.id = animation.id;
                config.event = event;
                config.path = new Array();
                config.destination = beast.location;

                if (Boolean(animation.movement)) {

                    switch (animation.destination) {
                        case 'self':
                            config.destination = beast.location;
                            break;
                        case 'attacker':
                            config.destination = attacker.location;
                            break;
                        case 'primary':
                            config.destination = primary;
                            break;
                        case 'target':
                            config.destination = target;
                            break;
                    }

                    if (~~animation.offset !== 0) {
                        switch (animation.orientation) {
                            case 'self':
                                config.destination = CombatLogic.getLocation(scene.map, config.destination, beast.orientation, animation.offset);
                                break;
                            case 'attacker':
                                config.destination = CombatLogic.getLocation(scene.map, config.destination, attacker.orientation, animation.offset);
                                break;
                            case 'primary':
                                config.destination = CombatLogic.getLocation(scene.map, config.destination, primary.orientation, animation.offset);
                                break;
                            case 'to-destination':
                                config.destination = CombatLogic.getLocation(scene.map, config.destination, CombatLogic.getOrientation(beast.location, target), animation.offset);
                                break;
                        }
                    }


                    if (animation.type === 'teleport') {
                        config.path = [config.destination]
                    } else {
                        config.path = BeastLogic.getPath(config.destination, BeastLogic.getRange(beast, scene.beasts, scene.map));
                    }
                }

                pending.push(config);
            });
        });

        return Promise.all(pending.map(config => this._startAnimationSegment(config)));
    }

    _startAnimationSegment({ beast, id, destination, path, event } = opts) {
        if (path.length !== 0 && destination !== beast.location) {
            const animations = BeastLogic.getMovementAnimations(beast, path, destination, id);
            beast.animate(animations, true);

            if (event === undefined)
                return Promise.resolve();

            return new Promise((resolve) => {
                Events.listen(event, (data, id) => {
                    console.log(beast, event, data, id)
                    if (data.unit !== beast)
                        return;
                    Events.remove(event, id);
                    resolve();
                }, true);
            });
        } else {
            const animation = new Object(),
                  config = BeastLogic.getAnimationConfig(beast, id, beast.orientation);
            
            animation.id = id;
            animation.variation = false;
            animation.mirrored = Boolean(config.mirrored);
            animation.config = (animation.variation && config.variation !== undefined) ? config.variation : config.frames;
            animation.ms = 0;
            animation.multipliers = new Array(animation.config.length).fill(1);
            animation.frame = 0;
            animation.destination = beast.location;
            animation.orientation = beast.orientation;
            animation.movement = false;
            animation.events = new Object();
            animation.events.end = { id: `${id}-complete`, data: beast };
            animation.x = animation.ox = ~~config.ox;
            animation.y = animation.oy = ~~config.oy;

            beast.animate(animation, true);

            if (event === undefined)
                return Promise.resolve();

            return new Promise((resolve) => {
                Events.listen(event, (data, id) => {
                    Events.remove(event, id);
                    resolve();
                }, true);
            });
        }
    }
    
    _doFilterSegment(segment, attacker, primary, secondary, target, selection, scene) {
        const promises = [Promise.resolve()],
              subjects = this._getAffected(segment.on, attacker, primary, secondary);

        subjects.forEach(beast => {
            for (let i = 0; i < segment.filters.length; i++) {
                beast.filters.push(Object.assign({ suffix: '', ms: 0, revert: false }, segment.filters[i]));
                if (segment.wait !== undefined) {
                    const complete = new Promise((resolve) => {
                        Events.listen(segment.wait, (data, id) => {
                            if (data.unit !== beast)
                                return;
                            Events.remove(segment.wait, id);
                            resolve();
                        }, true);
                    });
                    promises.push(complete);
                }
            }
        });

        return Promise.all(promises);
    }

    _doDamageSegment(segment, damage = 50, attacker, primary, secondary, target, selection, scene) {
        const subjects = this._getAffected(segment.on, attacker, primary, secondary);
        subjects.forEach(beast => beast.doDamage((segment.percentage / 100) * damage, segment.font));

        return Promise.resolve();
    }

    useSkill_effectSegment(segment, unit, target, selection, range, entities, map, effects) {
        return Promise.resolve();
    }

    useSkill_soundSegment(segment, sounds) {
        return Promise.resolve();
    }

    useSkill_cameraSegment(segment, camera) {
        return Promise.resolve();
    }

    useSkill_waitSegment(segment) {
        return Promise.resolve();
    }
}