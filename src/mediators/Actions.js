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
        const config = this.managers.skills.get(id),
              range = SkillLogic.getRange(config, attacker, scene.beasts, scene.map),
              selection = SkillLogic.getSelection(config, target, scene.beasts, scene.map, range/* range restriction */);

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
            await this._doSegment(config.sequence[i], attacker, target, selection, range, scene);

        return Promise.resolve();
    }

    // ----------------------------
    // Helper Functions
    // ---------------------------------

    async _doSegment(segment, attacker, target, selection, range, scene) {
        switch (segment.type) {
            case 'animation':
                return this._doAnimationSegment(segment, attacker, target, selection, range, scene);
            case 'damage':
                return this._doDamageSegment(segment, attacker, target, selection, range, scene);
            case 'filter':
                return this._doFilterSegment(segment, attacker, target, selection, range, scene);
            case 'effect':
                return this.useSkill_effectSegment(segment, attacker, target, selection, range, scene);
            case 'sound':
                return this.useSkill_soundSegment(segment, attacker, target, selection, range, scene);
            case 'camera':
                return this.useSkill_cameraSegment(segment, attacker, target, selection, range, scene);
            case 'wait':
                return this.useSkill_waitSegment(segment, attacker, target, selection, range, scene);
        }
    }

    // Animation_Segment <Object> ------------------------------------------------------
    //  -> type     <String> ['animation']                // segment type
    //  -> id       <String> ['slash', 'stagger',...]     // animation ID
    //  -> subject  <String> ['attacker', 'defender',...] // object to animate
    //  -> movement <Object>                              // movement data to be added to animation
    //      -> type       <String> ['teleport', 'normal',...]
    //      -> toLocation <String> ['target', 'target-before', 'behind',...]
    //  -> await    <String> ['hit', 'burst']             // event to wait on before continuing
    // -------------------------------------------------------------------------------------------------

    _doAnimationSegment(segment, attacker, target/* Location */, selection, range, scene) {
        const id      = segment.id,
              subject = segment.subject,
              event   = segment.await,
              hasMovement = segment.movement !== undefined,
              targets = (subject === 'attacker') ? [attacker] : scene.beasts.filter(beast => selection.has(beast.location));

        const animations = [];
        targets.forEach(actor => {
            const config = new Object();
            config.unit = actor;
            config.animationId = id;
            config.event = event;
            config.destination = actor.location;
            config.path = new Array();

            if (hasMovement) {
                const type = segment.movement.type,
                      toLocation = segment.movement.toLocation;

                let baseTarget = target,
                    baseOrientation = CombatLogic.getOrientation(actor.location, target);

                if (toLocation === 'target-before' || toLocation === 'front')
                    baseOrientation = CombatLogic.getOppositeOrientation(baseOrientation);
                
                if (subject === 'defender') {
                    if (toLocation === 'front') {
                        baseTarget = attacker.location;
                        baseOrientation = attacker.orientation;
                    } else if (toLocation === 'behind') {
                        baseTarget = attacker.location;
                        baseOrientation = CombatLogic.getOppositeOrientation(attacker.orientation);
                    }
                } else if (subject === 'attacker') {
                    const targetOrientation = scene.beasts.find(beast => beast.location === target)?.orientation;
                    if (targetOrientation !== undefined) {
                        if (toLocation === 'front') {
                            baseOrientation = targetOrientation;
                        } else if (toLocation === 'behind') {
                            baseOrientation = CombatLogic.getOppositeOrientation(targetOrientation);
                        }
                    }
                }

                config.destination = (toLocation !== 'target') ? CombatLogic.getNextLocation(scene.map, baseTarget, baseOrientation) : target;

                if (type === 'teleport') {
                    config.path.push(config.destination);
                } else {
                    config.path = BeastLogic.getPath(config.destination, BeastLogic.getRange(actor, scene.beasts, scene.map));
                }
            }

            animations.push(config);
        });

        return Promise.all(animations.map(config => this._startAnimationSegment(config)));
    }

    _startAnimationSegment({ unit, animationId, destination, path, event } = opts) {
        if (path.length !== 0 && destination !== unit.location) {
            const animations = BeastLogic.getMovementAnimations(unit, path, destination, animationId);
            unit.animate(animations, true);

            return new Promise((resolve) => {
                Events.listen(event, (data, id) => {
                    if (data.unit !== unit)
                        return;
                    Events.remove(event, id);
                    resolve();
                }, true);
            });
        } else {
            const animation = new Object(),
                  config = BeastLogic.getAnimationConfig(unit, animationId, unit.orientation);
            
            animation.id = animationId;
            animation.variation = false;
            animation.mirrored = Boolean(config.mirrored);
            animation.config = (animation.variation && config.variation !== undefined) ? config.variation : config.frames;
            animation.ms = 0;
            animation.multipliers = new Array(animation.config.length).fill(1);
            animation.frame = 0;
            animation.destination = unit.location;
            animation.orientation = unit.orientation;
            animation.movement = false;
            animation.events = new Object();
            animation.events.end = { id: `${animationId}-complete`, data: unit };
            animation.x = animation.ox = ~~config.ox;
            animation.y = animation.oy = ~~config.oy;

            unit.animate(animation, true);

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
    
    _doFilterSegment(segment, attacker, target/* Location */, selection, range, scene) {
        const unitsToFilter = segment.subject === 'attacker' ? [attacker] : scene.beasts.filter(beast => selection.has(beast.location)),
              promises = [Promise.resolve()];

        unitsToFilter.forEach(beast => {
            segment.filters.forEach(filter => {
                beast.filters.push({
                    type: filter.type,
                    suffix: filter.suffix || '',
                    initial: filter.initial,
                    value: filter.initial,
                    target: filter.target,
                    ms: 0,
                    duration: filter.duration,
                    reverse: filter.reverse || false
                });
            });

            if (segment.await !== undefined) {
                const complete = new Promise((resolve) => {
                    Events.listen(segment.await, (data, id) => {
                        if (data.unit !== beast)
                            return;
                        Events.remove(segment.await, id);
                        resolve();
                    }, true);
                });
                promises.push(complete);
            }
        });

        return Promise.all(promises);
    }

    _doDamageSegment(segment, attacker, target/* Location */, selection, range, scene) {
        const unitsToDamage = segment.subject === 'attacker' ? [attacker] : scene.beasts.filter(beast => selection.has(beast.location));

        unitsToDamage.forEach(beast => {
            beast.doDamage(segment.amount, segment.fontSize);
        });

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