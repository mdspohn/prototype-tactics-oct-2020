class Pathing {
    static getRange(opts, scene, range = new WeakMap(), selection = null) {
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
              continueOnEntities     = Boolean(opts.continueOnEntity),
              continueOnObstructions = Boolean(opts.continueOnObstructions),
              continueOnHazards      = Boolean(opts.continueOnHazards),
              useHazardLeap          = Boolean(opts.useHazardLeap),
              waterIsHazard          = Boolean(opts.waterIsHazard),
              hazardLeap             = ~~opts.hazardLeap;

        let validLocation = !range.has(location) || range.get(location).steps > steps;
        validLocation &= restrictedRange === undefined || restrictedRange.has(location);

        if (!validLocation)
            return;

        let selectable = min <= steps,
            isHazard = location.isHazard || (waterIsHazard && location.isWater),
            advance = steps < max;

        // check things that don't apply to the point of origin
        if (previous !== undefined) {

            // height
            if (((previous.z - location.z) < zDown) || ((previous.z - location.z) > zUp))
                return;

            // entities
            const occupant = scene.beasts.find(beast => beast.location === location);
            if (occupant !== undefined) {
                selectable &= selectableEntities;
                advance &= continueOnEntities;
            }
            
            // hazards
            if (isHazard) {
                selectable &= selectableHazards;
                if (useHazardLeap) {
                    if (hazardLeap > 0) {
                        opts.hazardLeap = hazardLeap - 1;
                        opts.orientationLock = true;
                        opts.orientation = CombatLogic.getOrientation(previous, location);
                    } else {
                        advance = false;
                    }
                } else {
                    advance &= continueOnHazards;
                }
            }
        }

        if (selectable || advance) {
            range.set(location, {
                previous,
                steps,
                selectable,
                isHazard
            });

            if (selection !== null)
                selection.push(location);
        }

        if (!advance)
            return;
        
        const nextLocations = new Array();
        if (orientationLock && orientation !== undefined) {
            nextLocations.push(CombatLogic.getLocation(scene.map, location, orientation, 1));
        } else {
            nextLocations.push(scene.map.getLocation(location.x - 1, location.y));
            nextLocations.push(scene.map.getLocation(location.x + 1, location.y));
            nextLocations.push(scene.map.getLocation(location.x, location.y - 1));
            nextLocations.push(scene.map.getLocation(location.x, location.y + 1));
        }

        for (next in nextLocations) {
            // is this a valid location
            if (next === undefined || !next.isReachable)
                return;
            
            const optsChanges = new Object();
            optsChanges.start = next;
            optsChanges.previous = location;
            optsChanges.steps = steps + 1;
            optsChanges.orientation = CombatLogic.getOrientation(location, next);

            this.getRange(Object.assign(opts, optsChanges), scene, range, selection);
        }

        range.asArray = () => selection;
        return range;

    }

    static getPathTo(location, range) {

    }
}