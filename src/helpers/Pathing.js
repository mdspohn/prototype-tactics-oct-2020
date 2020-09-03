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

    _addToRange(range, layout, entities, location, previous, distance, steps, restrictions) {
        const zUp = restrictions.zUp,
              zDown = restrictions.zDown,
              targets = restrictions.targets,
              blockers = restrictions.blockers,
              includeWater = restrictions.includeWater,
              hazardDistance = restrictions.hazardDistance;
        
        // only add location to map if it doesn't exist already or exists with more steps
        if (!range.has(location) || range.get(location).steps > steps) {

            let selectable = true,
                obstruction = false,
                hazard = false;
                
            if (previous !== null) {

                // abides by z-axis restrictions?

                // abides by hazard restrictions?

                // abides by entity targetting/blocking restrictions?
                const blocker = entities.find(entity => entity.location === location);
                if (blocker !== undefined) {
                    selectable = !targets.includes(blocker.getAllegiance());
                    obstruction = blockers.includes(blocker.getAllegiance());
                }

                if (obstruction)
                    return;
            }

            range.set(location, { previous, steps, selectable, obstruction, hazard });

            if (steps >= distance)
                return;

            const n = layout.getLocation(location.x, location.y - 1),
                  s = layout.getLocation(location.x, location.y + 1),
                  e = layout.getLocation(location.x + 1, location.y),
                  w = layout.getLocation(location.x - 1, location.y);

            let nextPrevious = (obstruction) ? previous : location;

            [n, s, e, w].forEach(nextLocation => {
                if (nextLocation !== undefined)
                    this._addToRange(range, layout, entities, nextLocation, nextPrevious, distance, (steps + 1), restrictions);
            });
        }

        return range;
    }

    _addLocationToPattern(range, location, opts) {

    }

    _addLocationToRange(range, location, opts) {
        // opts <Object>
        //      .previous <Location>
        //      .distance <Int>
        //      .steps <Int>
        //      .targets <Array> ['EMPTY', 'SELF', 'ALLY', 'NEUTRAL', 'FOE']
        //      .obstructions <Array> ['HAZARD', 'ALLY', 'NEUTRAL', 'FOE']
        //      .waterIsHazard <Boolean>
        //      .hasTrajectory <Boolean>
        //      .trajectory <String> ...PARABOLA, LINEAR, ORBITAL
        //      .jumpUp <Int>
        //      .jumpDown <Int>
        //      .jumpHazard <Int>

        if (!range.has(location) || range.get(location).steps > opts.steps) {
            const config = new Object();
            config.previous = opts.previous;
            config.steps = opts.steps;
            config.selectable = true;
            config.hazard = false;
            config.obstruction = false;

            range.set(location, config);
        }
    }

    getRange(opts) {
        const range = new WeakMap();
        this._addLocationToRange(range, opts.location, opts);
        return range;
    }

    getMovementRange(layout, entities, beast) {
        return this._addToRange(
            new WeakMap(),
            layout,
            entities,
            beast.location,
            null,
            beast.move,
            0,
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
        return this._addToRange(
            new WeakMap(),
            layout,
            entities,
            location,
            null,
            skill.range,
            0,
            {
                zUp: skill.z,                        // max z difference when going up
                zDown: skill.z,                      // max z difference when going down
                targets: ['ally', 'neutral', 'foe'], // will not count these target types as obstructions and include them in range (empty array for moving)
                blockers: ['neutral', 'foe'],        // pathing cannot continue through these entity types
                includeWater: true,                  // whether water is a selectable tile
                hazardDistance: skill.range          // max hazard tiles that can be jumped over
            }
        );
    }

    isValidLocation(location, range) {
        return range.has(location) && range.get(location).valid;
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