class Pathing {
    constructor() {
        this.patterns = new Object();
        this.patterns.POINT = (range, location, layout, opts) => {
            range.set(location, { markerType: opts.markerType });
        };
        this.patterns.CROSS_EXCLUSIVE = (range, location, layout, opts) => {
            // expects opts.z, opts.distance
            for(let i = 1; i <= opts.distance; i++) {
                const n = layout.getLocation(location.x + i, location.y),
                      e = layout.getLocation(location.x, location.y + i),
                      s = layout.getLocation(location.x - i, location.y),
                      w = layout.getLocation(location.x, location.y - i);

                [n, e, s, w].forEach(tile => {
                    if (tile === undefined)
                        return;
                    
                    const zo = Math.abs(location.z() - tile.z());
                    if (zo > ~~opts.z)
                        return;

                    range.set(tile, { markerType: opts.markerType });
                });
            }
        };
        this.patterns.CROSS_INCLUSIVE = (range, location, layout, opts) => {
            range.set(location, { markerType: opts.markerType });
            this.patterns.CROSS_EXCLUSIVE(range, location, layout, opts);
        };
    }

    getSelectionRange(location, layout, opts) {
        const range = new WeakMap();
        this.patterns[opts.pattern](range, location, layout, Object.assign({ markerType: 'red' }, opts));
        return range;
    }

    getSkillRange(location, layout, opts) {
        if (!this.patterns.hasOwnProperty(opts.pattern))
            return console.warn('Skill pattern not found: ', opts.pattern);

        const range = new WeakMap();
        this.patterns[opts.pattern](range, location, layout, Object.assign({ markerType: 'yellow' }, opts));
        return range;
    }

    getMovementRange(beast, entities, layout) {
        const range = new WeakMap();
        this._addToMovementRange(range, beast.location, layout, beast, entities, {
            previous: undefined,
            distance: beast.getMovement(),
            steps: 0,
            hazardLeap: Math.floor(beast.jump / 2)
        });
        return range;
    }

    _addToMovementRange(range, location, layout, entity, entities, opts) {
        if (!range.has(location) || range.get(location).steps > opts.steps) {
            const occupant = entities.find(entity => entity.location === location),
                  allegiance = entity.getAllegianceTo(occupant);
            
            // check if tile should be considered a hazard to possibly jump over
            let isHazard = false;
            isHazard |= location.z() === 0 && !entity.canFloat() && !entity.canFly();
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
            config.markerType = 'white';

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

                if (config.isHazard && ((Util.getOrientationTo(next, location) != Util.getOrientationTo(location, opts.previous)) || !config.canLeap))
                    return;

                const zDiff = next.z() - location.z();
                if (zDiff < (-entity.jump - 1) || zDiff > entity.jump)
                    return;
                
                this._addToMovementRange(range, next, layout, entity, entities, {
                    previous: location,
                    distance: opts.distance,
                    steps: opts.steps + 1,
                    hazardLeap: (isHazard) ? (opts.hazardLeap - (1 * isHazard)) : Math.floor(entity.jump / 2)
                });
            });
        }
    }

    isValidSelection(location, range) {
        return !!range && range.has(location) && range.get(location).isSelectable;
    }

    isInRange(location, range) {
       return range.has(location);
    }

    getPathing(location, range) {
        const path = new Array();

        let next = location;
        while (range.has(next)) {
            path.push(next);
            next = range.get(next).previous;
        }

        return path;
    }
}