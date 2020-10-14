class Actions {
    constructor(managers) {
        this.managers = managers;
    }

    // -------------------------
    // Turn Management
    // -------------------------------

    async nextTurn(scene, states) {
        let next = scene.beasts.find(beast => beast.energy >= 100);
        while (next === undefined) {
            const ready = scene.beasts.filter(beast => {
                if (beast.isAlive()) {
                    beast.energy += beast.stats.current.speed;
                    return beast.energy >= 100;
                }
                return false;
            }).sort((a, b) => b.energy - a.energy);

            next = ready[0];
        }
        next.energy -= 100;

        scene.active = next;
        scene.active.resetTurn();
        scene.ui.updateTurns(CombatLogic.getTurnOrder(scene.beasts), scene.active);
        scene.camera.toLocation(scene.active.location, 750, 'ease-out');
        await scene.ui.nextTurn(scene.active);

        return Promise.resolve((scene.active.ai) ? states.AI_TURN : states.PLAYER_TURN);
    }

    // ------------------------
    // Player Actions
    // -----------------------------

    async requestMove(scene, states) {
        scene.markers.range = BeastLogic.getRange(scene.active, scene);
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

        const path = BeastLogic.getPath(target, scene.markers.range),
              distance = Math.abs(target.x - scene.active.location.x) + Math.abs(target.y - scene.active.location.y);

        scene.active.traveled.last += distance;
        scene.active.traveled.total += distance;

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
        scene.markers.range = SkillLogic.getRange(this.managers.skills.get(id), scene.active.location, scene);
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

    async changeOrientation(beast, arg1, arg2) {
        let orientation = arg1;
        if (arg1 instanceof Location) {
            orientation = CombatLogic.getOrientation(beast.location, arg1);
        } else if (arg2 !== undefined) {
            orientation = CombatLogic.getOrientationToCoords(beast, arg1, arg2);
        }

        beast.changeOrientation(orientation);

        return Promise.resolve(orientation);
    }

    async move(beast, path, id = null) {
        const complete = (resolve) => {
            Events.listen('move-complete', (data, id) => {
                if (data.unit !== beast)
                    return;
                Events.remove('move-complete', id);
                resolve(data);
            }, true);
        };

        const animations = BeastLogic.getMovementAnimation(beast, id, path[path.length - 1], path);
        beast.animate(animations);

        return new Promise(complete);
    }

    async useSkill(id, attacker, target, scene) {
        const skill = this.managers.skills.get(id),
              range = SkillLogic.getRange(skill, attacker.location, scene);

        if (!range.has(target))
            return Promise.resolve();
        
        const selection = SkillLogic.getSelection(skill, target, scene, range),
              secondary = scene.beasts.filter(beast => selection.has(beast.location)),
              primary = secondary.find(beast => beast.location === target);

        // -----------------
        // Calculate Damage / Crit
        // ----------------------

        // -------------------
        // Animation Sequence
        // -------------------------------

        await this.changeOrientation(attacker, target);

        for (let i = 0; i < skill.sequence.length; i++) {
            const segment = skill.sequence[i],
                  subjects = (segment.on === 'self') ? [attacker] : [];

            if (primary !== undefined  && ['primary',   'all'].includes(segment.on))
                subjects.push(primary);
            if (secondary.length !== 0 && ['secondary', 'all'].includes(segment.on))
                subjects.push(...secondary);

            if (segment.category === 'animation') {
                await this.doAnimationSegment(segment, subjects, target, primary, scene);
            } else if (segment.category === 'damage') {
                await this.doDamageSegment(segment, subjects, skill);
            } else if (segment.category === 'filter') {
                await this.doFilterSegment(segment, subjects);
            }
        }

        return Promise.resolve();
    }

    async doDamageSegment(segment, subjects, skill) {
        subjects.forEach(beast => beast.doDamage((segment.percentage / 100) * ~~skill.power));

        return new Promise((resolve) => {
            if (subjects.length === 0 || segment.wait === undefined)
                resolve();
            
            Events.listen(segment.wait, () => resolve());
        });
    }

    async doFilterSegment(segment, subjects) {
        for (let i = 0; i < subjects.length; i++) {
            for (let j = 0; j < segment.filters.length; j++) {
                const id = segment.filters[j].type;
                Object.assign(subjects[i].filters[id], { initial: subjects[i].filters[id].value, ms: 0 }, segment.filters[j]);
            }
        }

        return new Promise((resolve) => {
            if (subjects.length === 0 || segment.wait === undefined)
                resolve();
            
            Events.listen(segment.wait, () => resolve());
        });
    }

    async doAnimationSegment(segment, subjects, target, primary, scene) {
        subjects.forEach(beast => {
            const animations = new Array();
            segment.animations.forEach(animation => {
                let destination = beast.location,
                    path;

                if (animation.movement) {
                    switch (animation.destination) {
                        case 'self':
                            destination = beast.location;
                            break;
                        case 'attacker':
                            destination = attacker.location;
                            break;
                        case 'primary':
                            destination = primary;
                            break;
                        case 'target':
                            destination = target;
                            break;
                    }

                    if (~~animation.offset !== 0) {
                        switch (animation.orientation) {
                            case 'self':
                                destination = CombatLogic.getLocation(scene.map, destination, beast.orientation, animation.offset);
                                break;
                            case 'attacker':
                                destination = CombatLogic.getLocation(scene.map, destination, attacker.orientation, animation.offset);
                                break;
                            case 'primary':
                                destination = CombatLogic.getLocation(scene.map, destination, primary.orientation, animation.offset);
                                break;
                            case 'to-destination':
                                destination = CombatLogic.getLocation(scene.map, destination, CombatLogic.getOrientation(beast.location, target), animation.offset);
                                break;
                        }
                    }

                    path = (animation.type === 'teleport') ? [destination] : BeastLogic.getPath(destination, BeastLogic.getRange(beast, scene));
                }
                
                if (destination !== beast.location) {
                    animations.push(...BeastLogic.getMovementAnimation(beast, animation.id, destination, path));
                } else {
                    animations.push(BeastLogic.getAnimation(beast, animation.id, beast.orientation));
                }
            });

            beast.animate(animations, true);
        });

        return new Promise((resolve) => {
            if (subjects.length === 0 || segment.wait === undefined)
                resolve();
            
            Events.listen(segment.wait, () => resolve());
        });
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