class Actions {
    constructor(managers) {
        this.managers = managers;
    }

    // -------------------------
    // Turn Management
    // -------------------------------

    async nextTurn(scene, states) {
        scene.active = CombatLogic.getNextTurn(scene.beasts);
        scene.active.resetTurn();
        scene.ui.updateTurns(CombatLogic.getTurns(scene.beasts), scene.active);
        scene.camera.toLocation(scene.active.location, 750, 'ease-out');
        await scene.ui.nextTurn(scene.active);

        return Promise.resolve((scene.active.ai) ? states.AI_TURN : states.PLAYER_TURN);
    }

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
        await this.skill(id, scene.active, target, scene);
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

    async skill(id, attacker, target, scene) {
        const config = this.managers.skills.get(id),
              range = SkillLogic.getRange(config, attacker, scene.beasts, scene.map),
              selection = SkillLogic.getSelection(config, target, scene.beasts, scene.map, range/* range restriction */);

        // -----------------
        // Calculate Damage / Crit
        // ----------------------

        // -------------------
        // Animation Sequence
        // -------------------------------

        for (let i = 0; i < config.sequence.length; i++)
            await this._doSegment(config.sequence[i], attacker, target, selection, range, scene);

        return Promise.resolve();
    }

    async changeOrientation(unit, x, y) {
        const orientation = CombatLogic.getOrientationToCoords(unit, x, y);
        if (unit.orientation !== orientation) {
            unit.orientation = orientation;
            const animation = BeastLogic.getDefaultAnimation(unit, unit.animation);
            animation.frame = unit.animations.current.frame;
            animation.ms = unit.animations.current.ms;
            unit.animate(animation, true);
        }

        return Promise.resolve(orientation);
    }

    // ----------------------------
    // Helper Functions
    // ---------------------------------

    async _doSegment(segment, attacker, target, selection, range, scene) {
        switch (segment.type) {
            case 'animation':
                return this.useSkill_animationSegment(segment, attacker, target, selection, range, scene.beasts, scene.map);
            case 'effect':
                return this.useSkill_effectSegment(segment, attacker, target, selection, range, scene.beasts, scene.map, this.managers.effects);
            case 'filter':
                return this.useSkill_filterSegment(segment, attacker, selection, scene.beasts);
            case 'damage':
                return this.useSkill_damageSegment(segment, attacker, selection, scene.beasts);
            case 'sound':
                return this.useSkill_soundSegment(segment, this.managers.sounds);
            case 'camera':
                return this.useSkill_cameraSegment(segment, scene.camera);
            case 'wait':
                return this.useSkill_waitSegment(segment);
        }
    }

    useSkill_animationSegment(segment, unit, target, selection, range, entities, map) {
        const unitsToAnimate = segment.unit === 'attacker' ? [unit] : entities.filter(entity => selection.has(entity.location)),
              pending = new Array();

        for (let i = 0; i < unitsToAnimate.length; i++) {
            const actor = unitsToAnimate[i];
            let destination = target, path = new Array();

            if (segment.movement) {
                switch (segment.location) {
                    case 'before-target':
                        destination = range.get(target).previous;
                        if (destination !== actor.location) {
                            let next = destination;
                            while (range.get(next) !== undefined && range.get(next).previous instanceof Location) {
                                path.unshift(next);
                                next = range.get(next).previous;
                            }
                        } else {
                            // skip movement animation segment if we don't actually move
                            continue;
                        }
                        break;
                    case 'knockback':
                        const location = CombatLogic.getKnockbackTile(unit, actor, map);
                        if (location !== undefined && !entities.some(entity => entity.location === location) && location.z <= actor.location.z) {
                            destination = location;
                            path = [destination];
                        } else {
                            destination = actor.location;
                        }
                        break;
                }
            }
            
            pending.push({
                unit: actor,
                animationId: segment.id,
                destination,
                path,
                event: segment.await
            });
        }

        if (segment.await !== undefined && pending.length !== 0)
            return Promise.all([...pending.map(opts => this.useSkill_animateUnit(opts))]);

        pending.forEach(opts => this.useSkill_animateUnit(opts));

        return Promise.resolve();
    }

    useSkill_animateUnit({ unit, animationId, destination, path, event } = opts) {
        if (path.length !== 0) {
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

            return new Promise((resolve) => {
                Events.listen(event, (data, id) => {
                    Events.remove(event, id);
                    resolve();
                }, true);
            });
        }
    }

    useSkill_filterSegment(segment, unit, selection, entities) {
        const unitsToFilter = segment.unit === 'attacker' ? [unit] : entities.filter(entity => selection.has(entity.location)),
              promises = [Promise.resolve()];

        unitsToFilter.forEach(target => {
            segment.filters.forEach(filter => {
                target.filters.push({
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
                        if (data.unit !== target)
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

    useSkill_damageSegment(segment, unit, selection, entities) {
        const unitsToDamage = segment.unit === 'attacker' ? [unit] : entities.filter(entity => selection.has(entity.location));

        unitsToDamage.forEach(target => {
            target.doDamage(segment.amount, segment.fontSize);
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