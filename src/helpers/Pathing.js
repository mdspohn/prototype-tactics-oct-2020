class Pathing {
    constructor() {
        this.obstructions = new Object(); // obstruction level of -1 passes through everything
        this.obstructions['ENEMY_ONLY'] = 0;
        this.obstructions['NEUTRAL'] = 1;
        this.obstructions['ALLY'] = 2;

        this.patterns = new Object();
        this.patterns['POINT'] = function(location, layout, opts) {
            return [location];
        };
        this.patterns['CROSS_EXCLUSIVE'] = function(location, layout, opts) {
            const selection = [],
                  s1 = layout.getLocation(location.x + 1, location.y),
                  s2 = layout.getLocation(location.x - 1, location.y),
                  s3 = layout.getLocation(location.x, location.y + 1),
                  s4 = layout.getLocation(location.x, location.y - 1);
            
            [s1, s2, s3, s4].forEach(tile => {
                if (tile !== undefined)
                    selection.push(tile);
            });
            return selection;
        };
        this.patterns['CROSS_INCLUSIVE'] = function(location, layout, opts) {
            const selection = this.patterns['CROSS_EXCLUSIVE'](location, layout, opts);
            selection.push(location);
            return selection;
        };
    }

    _addToMovementRange(range, location, layout, entity, entities, opts) {
        if (!range.has(location) || range.get(location).steps > opts.steps) {
            const occupant = entities.find(entity => entity.location === location),
                  allegiance = entity.getAllegianceTo(occupant);
            
            // check if tile should be considered a hazard to possibly jump over
            let isHazard = false;
            isHazard |= location.z() === 0 && !entity.canFly();
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
            config.canPass = ['SELF', 'ALLY', 'NEUTRAL'].includes(allegiance) || entity.canFly() || entity.canPhase();

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

    isValidSelection(location, range) {
        return !!range && range.has(location) && range.get(location).isSelectable;
    }

    isInRange(location, range) {
       return range.has(location);
    }

    getPathing(location, range) {
        const path = [];

        if (range.has(location) && !!range.get(location).previous) {
            while (range.get(location).previous) {
                path.unshift(location);
                location = range.get(location).previous;
            }
        }

        return path;
    }
}