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

        // const test = {
        //     from: Location(),
        //     direction: 'ANY', // ['CARDINAL', 'DIAGONAL']
        //     select_obstructions: true,
        //     pass_obstructions: true,
        //     restrictions: {
        //         z_up: 2,
        //         z_down: 3,
        //         obstructions: [-1, 0, 1] // ALLY, NEUTRAL, FOE
        //     }
        // };
    }

    getPattern(fromLocation, distance, z_up, z_down, includeWater, includeEntities, stopOnObstructions, pattern) {

    }

    _addToRange(range, layout, entities, location, previous, distance, steps, opts) {
        const z = ~~opts.z,
              waterObstructs = Boolean(opts.waterObstructs),
              includeObstructions = Boolean(opts.includeObstructions),
              entityObstructionLevel = ~~opts.entityObstructionLevel,
              stopOnObstructions = Boolean(opts.stopOnObstructions);

        // only add location to map if it doesn't exist already or exists with more steps
        if (!range.has(location) || range.get(location).steps > steps) {
            // make sure location abides by restrictions
            let valid = true,
                obstruction = false;
            
            if (previous !== null) {

                // check height restrictions
                const zChange = location.z() - previous.z();
                if (Math.abs(zChange) > z) {
                    if (Math.abs(zChange) > (z + 1)) {
                        valid = false;
                    } else if (location.isSlope() || previous.isSlope()) {
                        // TODO check if z movement is allowed because of slope
                    }
                }

                // check water restrictions
                if (waterObstructs) {
                    obstruction &= location.isWater();
                }

                // check entity restrictions
                if (entityObstructionLevel !== -1) {

                }
            }

            if (!valid || (obstruction && stopOnObstructions))
                return;

            range.set(location, { previous, steps, obstruction });

            if (steps >= distance)
                return;

            const n = layout.getLocation(location.x, location.y - 1),
                  s = layout.getLocation(location.x, location.y + 1),
                  e = layout.getLocation(location.x + 1, location.y),
                  w = layout.getLocation(location.x - 1, location.y);

            let nextPrevious = (obstruction) ? previous : location;

            [n, s, e, w].forEach(nextLocation => {
                if (nextLocation !== undefined)
                    this._addToRange(range, layout, entities, nextLocation, nextPrevious, distance, (steps + 1), opts);
            });
        }

        return range;
    }

    getRange(layout, entities, location, distance, opts = {}) {
        return this._addToRange(new WeakMap(), layout, entities, location, null, distance, 0, opts);
    }

    getMovementRange(layout, entities, beast) {
        return this.getRange(
            layout,
            entities,
            beast.location,
            beast.move,
            {
                zUp: beast.jump,                                 // max z difference when going up
                zDown: (beast.jump + 1),                         // max z difference when going down
                targets: [],                                     // will not count these target types as obstructions and include them in range (empty array for moving)
                blockers: ['neutral', 'foe'],                    // pathing cannot continue through these entity types
                includeWater: beast.canSwim() || beast.canFly(), // whether water is a selectable tile
                hazardDistance: Math.floor(beast.jump / 2)       // max hazard tiles that can be jumped over
            }
        );
    }

    getSkillRange(layout, entities, location, skill) {

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