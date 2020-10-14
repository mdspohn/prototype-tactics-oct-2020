class PathingLogic {
    static getRange(scene, opts, range = new WeakMap(), asArray = null) {
        const location = opts.location,
              previous = opts.previous,
              steps = ~~opts.steps,
              min = ~~opts.min,
              max = ~~opts.max,
              zUp = ~~opts.zUp,
              zDown = -(~~opts.zDown),
              restrictedRange = opts.restrictedRange,
              orientation     = opts.orientation,
              orientationLock = Boolean(opts.orientationLock),
              selectableEntities     = Boolean(opts.selectableEntities),
              selectableObstructions = Boolean(opts.selectableObstructions),
              selectableHazards      = Boolean(opts.selectableHazards),
              continueOnEntities     = Boolean(opts.continueOnEntities),
              continueOnObstructions = Boolean(opts.continueOnObstructions),
              continueOnHazards      = Boolean(opts.continueOnHazards),
              useHazardLeap          = Boolean(opts.useHazardLeap),
              waterIsHazard          = Boolean(opts.waterIsHazard),
              hazardLeap             = ~~opts.hazardLeap;

        let validLocation = !range.has(location) || range.get(location).steps > steps;
        validLocation &= (restrictedRange === undefined || restrictedRange.has(location));

        if (!validLocation)
            return;

        let isSelectable = min <= steps,
            isHazard = location.isHazard || (waterIsHazard && location.isWater),
            continuePathing = steps < max;

        // check things that don't apply to the point of origin
        if (previous !== undefined) {

            // height
            if (((previous.z - location.z) < zDown) || ((previous.z - location.z) > zUp))
                return;

            // entities
            const occupant = scene.beasts.find(beast => beast.location === location);
            isSelectable &= ((occupant === undefined) || selectableEntities);
            continuePathing &= ((occupant === undefined) || continueOnEntities);
            
            // hazards
            isSelectable &= (!isHazard || selectableHazards);
            continuePathing &= (!isHazard || continueOnHazards || (useHazardLeap && hazardLeap > 0));

            if (isHazard && useHazardLeap && hazardLeap > 0 && !selectableHazards) {
                opts.hazardLeap = hazardLeap - 1;
                opts.orientation = CombatLogic.getOrientation(previous, location);
                opts.orientationLock = true;
            }
        }

        if (isSelectable || continuePathing) {
            range.set(location, { previous, steps, isSelectable, isHazard });

            if (asArray !== null)
                asArray.push(location);
        }

        if (continuePathing) {
            const nextLocations = new Array();
            if (orientationLock && orientation !== undefined) {
                nextLocations.push(CombatLogic.getLocation(scene.map, location, orientation, 1));
            } else {
                nextLocations.push(scene.map.getLocation(location.x - 1, location.y));
                nextLocations.push(scene.map.getLocation(location.x + 1, location.y));
                nextLocations.push(scene.map.getLocation(location.x, location.y - 1));
                nextLocations.push(scene.map.getLocation(location.x, location.y + 1));
            }

            nextLocations.forEach(next => {
                if (next === undefined || !next.isReachable)
                    return;
                
                const optsChanges = new Object();
                optsChanges.location = next;
                optsChanges.previous = location;
                optsChanges.steps = steps + 1;
                optsChanges.orientation = CombatLogic.getOrientation(location, next);

                this.getRange(scene, Object.assign(opts, optsChanges), range, asArray);
            });
        }

        if (steps === 0) {
            range.asArray = () => asArray;
            return range;
        }

    }

    static getPathTo(location, range) {
        let path = new Array(),
            next = location;

        while (range.get(next) !== undefined && range.get(next).previous instanceof Location) {
            path.unshift(next);
            next = range.get(next).previous;
        }

        return path;
    }
}