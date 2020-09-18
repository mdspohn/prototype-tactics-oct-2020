class MovementLogic {
    static getMovementRange(beast, entities, layout) {
        const range = new WeakMap();
        this.addToMovementRange(range, beast.location, layout, beast, entities, {
            previous: undefined,
            distance: beast.getMovement(),
            steps: 0,
            hazardLeap: Math.floor(beast.jump / 2)
        });
        return range;
    }

    static addToMovementRange(range, location, layout, entity, entities, opts) {
        if (!range.has(location) || range.get(location).steps > opts.steps) {
            const occupant = entities.find(entity => entity.location === location),
                  allegiance = GeneralLogic.getAllegiance(entity, occupant);
            
            // check if tile should be considered a hazard to possibly jump over
            let isHazard = false;
            isHazard |= location.getZ() === 0 && !entity.canFloat() && !entity.canFly();
            isHazard |= location.isWater() && !entity.canSwim() && !entity.canFly();

            // check if tile can be moved to
            let isSelectable = !isHazard;
            isSelectable &= occupant === undefined;

            const config = new Object();
            config.previous = opts.previous;
            config.steps = opts.steps;
            config.isHazard = Boolean(isHazard);
            config.canLeap = opts.hazardLeap >= 1;
            config.isSelectable = Boolean(isSelectable);
            config.occupant = occupant;
            config.canPass = ['SELF', 'ALLY'].includes(allegiance) || entity.canFly() || entity.canPhase();
            config.color = 'white';

            range.set(location, config);

            if (opts.steps >= opts.distance)
                return;

            Array.of(
                layout.getLocation(location.x, location.y - 1),
                layout.getLocation(location.x, location.y + 1),
                layout.getLocation(location.x + 1, location.y),
                layout.getLocation(location.x - 1, location.y)
            ).forEach(next => {
                if (next === undefined)
                    return;

                if (config.isHazard && ((GeneralLogic.getOrientationTo(next, location) != GeneralLogic.getOrientationTo(location, opts.previous)) || !config.canLeap))
                    return;

                const zDiff = next.getZ() - location.getZ();
                if (zDiff < (-entity.jump - 1) || zDiff > entity.jump)
                    return;
                
                this.addToMovementRange(range, next, layout, entity, entities, {
                    previous: location,
                    distance: opts.distance,
                    steps: opts.steps + 1,
                    hazardLeap: (isHazard) ? (opts.hazardLeap - (1 * isHazard)) : Math.floor(entity.jump / 2)
                });
            });
        }
    }

    static getPathing(location, range) {
        const path = new Array();

        let next = location;
        while (range.get(next).previous !== undefined) {
            path.unshift(next);
            next = range.get(next).previous;
        }

        return path;
    }

    static isValidSelection(location, range) {
        return !!range && range.has(location) && range.get(location).isSelectable;
    }

    static isInRange(location, range) {
       return range.has(location);
    }
}