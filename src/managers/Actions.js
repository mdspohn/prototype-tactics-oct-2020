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

    async move(unit, path) {
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
        unit.animationQueue.push(...BeastLogic.getMovementAnimations(unit, path, destination));

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
    // Unit Attacking
    // -----------------------------------

    async useSkill(skill, unit, selection, entities, map, effects, sounds) {
        const sequence = SkillLogic.getSequence(skill);

        await effects.animate('dust', unit.location);
        BeastLogic.animate(unit, 'slash');
        effects.animate('slash', target.location);
        await BeastLogic.animate(target, 'hit');

        const damage = 23;
        effects.damage(damage, target.location, 'white');

        unit.tp -= skill.tp;

    //     const skill = {
    //         id: 'slash',
    //         range: {},
    //         selection: {},
    //         basic: true,
    //         tp: 10,
    //         power: 100,
    //         sequence: [
    //             {
    //                 category: 'sound',
    //                 id: 'slash'
    //             },
    //             {
    //                 category: 'effect',
    //                 type: 'tile', // tile or map
    //                 target: 'self',
    //                 id: 'dust',
    //                 z: 1
    //             },
    //             {
    //                 category: 'animation',
    //                 target: 'self',
    //                 id: 'slash',
    //                 wait: true
    //             },
    //             {
    //                 category: 'sound',
    //                 id: 'hit'
    //             },
    //             {
    //                 category: 'effect',
    //                 type: 'tile',
    //                 target: 'selection',
    //                 restrictions: 'entities',
    //                 id: 'slash',
    //                 z: 1,
    //                 wait: true
    //             },
    //             {
    //                 category: 'animation',
    //                 target: 'selection',
    //                 restrictions: 'entities',
    //                 id: 'hit',
    //                 stagger: true
    //             },
    //             {
    //                 category: 'damage',
    //                 wait: true
    //             }
    //         ]
    //     }
    }
}