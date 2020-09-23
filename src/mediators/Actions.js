class Actions {
    constructor(managers) {
        this.managers = managers;
    }

    async move(unit, path, animationId = null) {
        const origin = unit.location,
              destination = path[path.length - 1],
              distance = Math.abs(destination.x - origin.x) + Math.abs(destination.y - origin.y);

        const complete = (resolve) => {
            const id = Events.listen('move-complete', (actor) => {
                if (actor !== unit)
                    return;
                Events.remove('move-complete', id);
                resolve();
            }, true);
        };

        unit.traveled.last += distance;
        unit.traveled.total += distance;
        unit.animate(BeastLogic.getMovementAnimations(unit, path, destination, animationId));

        return new Promise(complete);
    }

    async resetMove(unit) {
        if (unit.animations.checkpoint === null)
            return;
        
        unit.animate(Object.assign(unit.animations.checkpoint, { ms: 0, frame: 0 }), true);
        unit.location = unit.animations.checkpoint.destination;
        unit.orientation = unit.animations.checkpoint.orientation;

        unit.animations.checkpoint = null;
        unit.traveled.total -= unit.traveled.last;
        unit.traveled.last = 0;
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

    async useSkill(id, unit, target, entities, map, camera, effects, sounds) {
        const skill = Assets.getSkill(id),
              range = SkillLogic.getRange(id, unit, entities, map),
              selection = SkillLogic.getSelection(id, target, entities, map, range);

        // TODO: damage/crit calculations
        // - if melee crit, consider adding knockback movement to animation segment of defenders

        for (let i = 0; i < skill.sequence.length; i++) {
            switch (skill.sequence[i].type) {
                case 'animation':
                    await this.useSkill_animationSegment(skill.sequence[i], unit, target, selection, range, entities, map);
                    break;
                case 'effect':
                    await this.useSkill_effectSegment(skill.sequence[i], unit, target, selection, range, entities, map, effects);
                    break;
                case 'sound':
                    await this.useSkill_soundSegment(skill.sequence[i], sounds);
                    break;
                case 'camera':
                    await this.useSkill_cameraSegment(skill.sequence[i], camera);
                    break;
                case 'wait':
                    await this.useSkill_waitSegment(skill.sequence[i]);
                    break;
            }
        }

        return Promise.resolve();
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
                        if (location !== undefined && !entities.some(entity => entity.location === location) && location.getZ() <= actor.location.getZ()) {
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
                const id = Events.listen(event, (actor) => {
                    if (actor !== unit)
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
                const id = Events.listen(event, (actor) => {
                    if (actor !== unit)
                        return;
                    Events.remove(event, id);
                    resolve();
                }, true);
            });
        }
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