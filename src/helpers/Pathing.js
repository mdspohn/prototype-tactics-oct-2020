class Pathing {
    constructor() {
        this.patterns = new Object();
        this.patterns['POINT'] = function(range, location, layout, opts) {
            range.set(location, new Object());
        };
        this.patterns['CROSS_EXCLUSIVE'] = function(range, location, layout, opts) {
            // expects opts.z, opts.distance
            for(let i = 1; i <= opts.distance; i++) {
                const n = layout.getLocation(location.x + 1, location.y),
                      e = layout.getLocation(location.x, location.y + 1),
                      s = layout.getLocation(location.x - 1, location.y),
                      w = layout.getLocation(location.x, location.y - 1);

                [n, e, s, w].forEach(tile => {
                    if (tile === undefined)
                        return;
                    
                    const zo = Math.abs(location.z() - tile.z());
                    if (zo > ~~opts.z)
                        return;

                    range.set(tile, new Object());
                });
            }
        };
        this.patterns['CROSS_INCLUSIVE'] = function(range, location, layout, opts) {
            range.set(location, new Object());
            this.patterns['CROSS_EXCLUSIVE'](range, location, layout, opts);
        };
    }

    getSelectionRange(location, layout, opts) {
        return this.getSkillRange(location, layout, opts);
    }

    getSkillRange(location, layout, opts) {
        if (!this.patterns.hasOwnProperty(opts.pattern))
            return console.warn('Skill pattern not found: ', opts.pattern);

        const range = new WeakMap();
        this.patterns[opts.pattern](range, location, layout, opts);
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
            config.canPass = ['SELF', 'ALLY'].includes(allegiance) || entity.canFly() || entity.canPhase();
            config.markerType = 'movement';

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