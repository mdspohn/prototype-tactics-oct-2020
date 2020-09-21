class ActionManager {
    constructor() {
        this.cinematicMode = false;
    }

    isCinematic() {
        return this.cinematicMode;
    }

    enableCinematicMode() {
        this.cinematicMode = true;
    }

    disableCinematicMode() {
        this.cinematicMode = false;
    }

    // -------------------
    // Unit Movement
    // ----------------------------

    async move(unit, path, customAnimation = null) {
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

        unit.checkpoint.last += distance;
        unit.checkpoint.total += distance;
        unit.animationQueue.push(...BeastLogic.getMovementAnimations(unit, path, destination, customAnimation));

        return new Promise(complete);
    }

    resetMove(unit) {
        if (unit.checkpoint.animation === null)
            return;
        
        unit.animation = unit.checkpoint.animation;
        unit.animation.ms = 0;
        unit.animation.frame = 0;
        unit.orientation = unit.checkpoint.animation.orientation;
        unit.location = unit.checkpoint.animation.destination;

        unit.checkpoint.animation = null;
        unit.checkpoint.total -= unit.checkpoint.last;
        unit.checkpoint.last = 0;
    }

    changeOrientation(unit, x, y) {
        const orientation = CombatLogic.getOrientationToCoords(unit, x, y);
        if (unit.orientation === orientation)
            return;
        
        unit.orientation = orientation;
        const animation = BeastLogic.getDefaultAnimation(unit, unit.animation);
        animation.frame = unit.animation.frame;
        animation.ms = unit.animation.ms;
        unit.animation = animation;

        return orientation;
    }

    // -------------------------
    // Attacks / Skills
    // -----------------------------------

    _moveUnit(unit, path, destination, segment, force) {
        const animations = BeastLogic.getMovementAnimations(unit, path, destination, segment.id);
        unit.animationQueue.push(...animations);

        if (segment.wait) {
            return new Promise((resolve) => {
                const id = Events.listen(segment.wait, (actor) => {
                    if (actor !== unit)
                        return;
                    Events.remove(segment.wait, id);
                    resolve();
                }, true);
            });
        }

        return Promise.resolve();
    }

    _animateUnit(unit, segment, force = false) {
        const animation = new Object(),
              config = BeastLogic.getAnimationConfig(unit, segment.id, unit.orientation);

            animation.id = segment.id;
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
            animation.events.end = { id: `${segment.id}-complete`, data: unit };
            animation.x = animation.ox = ~~config.ox;
            animation.y = animation.oy = ~~config.oy;

        if (force) {
            unit.animation = animation;
        } else {
            unit.animationQueue.push(animation);
        }

        if (segment.wait) {
            return new Promise((resolve) => {
                const id = Events.listen(segment.wait, (actor) => {
                    if (actor !== unit)
                        return;
                    Events.remove(segment.wait, id);
                    resolve();
                }, true);
            });
        }

        return Promise.resolve();
    }

    _handleSegment(sequence, index, skill, unit, target, path, selection, entities, map, effects, sounds) {
        const segment  = sequence[index],
              actor   = segment.actor,
              category = segment.type;

        if (category === 'animation') {
            switch (actor) {
                case 'attacker':
                    return this._animateUnit(unit, segment, true);
                case 'defender':
                    const targetUnit = entities.find(entity => entity.location === target);
                    if (targetUnit !== undefined)
                        return this._animateUnit(targetUnit, segment, true);
                    return Promise.resolve();
                case 'adjacent':
                    return Promise.resolve();
            }
        } else if (category === 'movement') {
            switch (actor) {
                case 'attacker':
                    const destinationIndex = (segment.destination === 'to-target') ? path.length - 1 : path.length - 2;
                    return this._moveUnit(unit, path.slice(0, destinationIndex + 1), path[destinationIndex], segment, true);
                case 'defender':
                    break;
                case 'adjacent':
                    break;
            }
            
        }
    }

    async useSkill(skill, unit, target, path, selection, entities, map, effects, sounds) {
        const sequence = skill.sequence;

        for (let i = 0; i < sequence.length; i++)
            await this._handleSegment(sequence, i, skill, unit, target, path, selection, entities, map, effects, sounds);

        return Promise.resolve();
    }

    
    /*

    [
        
        {
            category: 'effect',
            target: 'attacker',
            id: 'crackle'
        },
        {
            category: 'animation',
            target: 'attacker',
            id: 'brace',
            wait: true
        },
        {
            category: 'movement',
            target: 'attacker',
            id: 'dash',
            destination: 'before-target',
            teleport: false,
            wait: true,
            onStep: [{
                category: 'animation',
                target: 'adjacent',
                id: 'hit'
            },
            {
                category: 'damage',
                target: 'adjacent',
                percent: 100
            }]
        },
        {
            category: 'animation',
            target: 'attacker',
            id: 'slash',
            wait: true
        },
        {
            category: 'effect',
            target: 'defender',
            id: 'lightning-strike'
        },
        {
            category: 'animation',
            target: 'defender',
            id: 'hit'
        },
        {
            category: 'damage',
            target: 'defender',
            percent: 100
        }
    ]
    */
}