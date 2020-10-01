class SkillLogic {

    static getRange(id, attacker, entities, layout) {
        const skill = Assets.getSkill(id),
              range = new WeakMap();
        SkillLogic._addPattern(skill.range.pattern, range, {
            location: attacker.location,
            orientation: null,
            entities: entities,
            layout: layout,
            restrictions: null,
            previous: null,
            step: 0,
            min: ~~skill.range.min,
            max: skill.range.max,
            z: skill.range.z,
            color: 'white',
            includeHazards: true, // XXX account for movement skills
            includeEntities: true // XXX account for movement skills
        });
        return range;
    }

    static getSelection(id, location, entities, layout, range = null) {
        const skill = Assets.getSkill(id),
              selection = new WeakMap();
        SkillLogic._addPattern(skill.selection.pattern, selection, {
            location: location,
            orientation: null,
            entities: entities,
            layout: layout,
            restrictions: range,
            previous: null,
            step: 0,
            min: ~~skill.selection.min,
            max: skill.selection.max,
            z: skill.selection.z,
            color: 'red',
            //secondary: 'yellow',
            includeHazards: true, // XXX account for movement skills
            includeEntities: true // XXX account for movement skills
        });
        return selection;
    }

    static _addPattern(id, range, opts) {
        switch(id) {
            case 'POINT':
                SkillLogic._addPointPattern(range, opts);
                break;
            case 'CARDINAL':
                SkillLogic._addCardinalPattern(range, opts);
                break;
            case 'FILL':
                SkillLogic._addFillPattern(range, opts);
                break;
            case 'CONCURRENT':
                SkillLogic._addConcurrentPattern(range, opts);
                break;
            case 'ENTITIES':
                SkillLogic._addEntityPattern(range, opts);
                break;
            default:
                return console.warn('Skill pattern not found: ', id);
        }
    }

    static _addPointPattern(range, opts) {
        if (!range.has(opts.location) || range.get(opts.location).step > opts.step) {

            // location restrictions
            if (opts.restrictions != null && (!opts.restrictions.has(opts.location) || !opts.restrictions.get(opts.location).isSelectable))
                return;
            
            // z-axis restrictions
            if (opts.previous != null && opts.z != null && Math.abs(opts.location.z - opts.previous.z) > opts.z)
                return;
            
            // add location and details to range
            const details = new Object();
            details.orientation = opts.orientation;
            details.previous = opts.previous;
            details.step = opts.step;
            details.isSelectable = opts.step >= opts.min;
            details.color = (opts.secondary && opts.step > 0) ? opts.secondary : opts.color;

            range.set(opts.location, details);

            if (opts.max !== null && opts.step >= opts.max)
                return;

            const X = opts.location.x,
                  Y = opts.location.y;

            Array.of(
                opts.layout.getLocation(X, Y - 1),
                opts.layout.getLocation(X, Y + 1),
                opts.layout.getLocation(X + 1, Y),
                opts.layout.getLocation(X - 1, Y)
            ).forEach(next => {
                if (next === undefined)
                    return;

                const NEXT_OPTS = Object.create(opts);
                NEXT_OPTS.location = next;
                NEXT_OPTS.previous = opts.location;
                NEXT_OPTS.step = opts.step + 1;
                NEXT_OPTS.orientation = CombatLogic.getOrientation(opts.location, next);

                SkillLogic._addPointPattern(range, NEXT_OPTS);
            });
        }
    }

    static _addCardinalPattern(range, opts) {
        if (opts.min === 0) {
            range.set(opts.location, {
                orientation: null,
                previous: null,
                step: opts.step,
                isSelectable: true,
                color: opts.color
            });
        }

        const X = opts.location.x,
              Y = opts.location.y;

        function passesRestrictions(previous, next) {
            if (previous === null || next === undefined)
                return false;
            if (opts.restrictions != null && !opts.restrictions.has(next))
                return false;
            if (opts.z != null && Math.abs(next.z - previous.z) > opts.z)
                return false;
            return true;
        }

        let PREVIOUS_WEST  = opts.location,
            PREVIOUS_EAST  = opts.location,
            PREVIOUS_SOUTH = opts.location,
            PREVIOUS_NORTH = opts.location;

        for(let i = Math.max(opts.min, 1); i <= opts.max; i++) {
            const WEST  = opts.layout.getLocation(X, Y - i),
                  EAST  = opts.layout.getLocation(X, Y + i),
                  SOUTH = opts.layout.getLocation(X + i, Y),
                  NORTH = opts.layout.getLocation(X - i, Y);

            if (passesRestrictions(PREVIOUS_WEST, WEST)) {
                range.set(WEST, { orientation: CombatLogic.ORIENTATIONS.WEST, previous: PREVIOUS_WEST,  isSelectable: i >= opts.min, color: opts.color });
                PREVIOUS_WEST = WEST;
            } else {
                PREVIOUS_WEST = null;
            }
            if (passesRestrictions(PREVIOUS_EAST, EAST)) {
                range.set(EAST, { orientation: CombatLogic.ORIENTATIONS.EAST, previous: PREVIOUS_EAST,  isSelectable: i >= opts.min, color: opts.color });
                PREVIOUS_EAST = EAST;
            } else {
                PREVIOUS_EAST = null;
            }
            if (passesRestrictions(PREVIOUS_SOUTH, SOUTH)) {
                range.set(SOUTH, { orientation: CombatLogic.ORIENTATIONS.SOUTH, previous: PREVIOUS_SOUTH,  isSelectable: i >= opts.min, color: opts.color });
                PREVIOUS_SOUTH = SOUTH;
            } else {
                PREVIOUS_SOUTH = null;
            }
            if (passesRestrictions(PREVIOUS_NORTH, NORTH)) {
                range.set(NORTH, { orientation: CombatLogic.ORIENTATIONS.NORTH, previous: PREVIOUS_NORTH,  isSelectable: i >= opts.min, color: opts.color });
                PREVIOUS_NORTH = NORTH;
            } else {
                PREVIOUS_NORTH = null;
            }
        }
    }

    static _addFillPattern(range, opts) {
        opts.layout.forEach(location => {
            if (!opts.restrictions.has(location))
                return;
            const config = Object.create(opts.restrictions.get(location));
            config.color = opts.color;

            range.set(location, config);
        });
    }

    static _addConcurrentPattern(range, opts) {
        if (!range.has(opts.location) || range.get(opts.location).step > opts.step) {

            // location restrictions
            if (!opts.restrictions.has(opts.location) || !opts.restrictions.get(opts.location).isSelectable)
                return;
            
            // z-axis restrictions
            if (opts.previous != null && opts.z != null && Math.abs(opts.location.z - opts.previous.z) > opts.z)
                return;
            
            // add location and details to range
            const details = new Object();
            details.orientation = opts.orientation;
            details.previous = opts.previous;
            details.step = opts.step;
            details.isSelectable = opts.step >= opts.min;
            details.color = (opts.secondary && opts.step > 0) ? opts.secondary : opts.color;

            range.set(opts.location, details);

            if (opts.max != null && opts.step >= opts.max)
                return;

            const X = opts.location.x,
                  Y = opts.location.y;

            Array.of(
                opts.layout.getLocation(X, Y - 1),
                opts.layout.getLocation(X, Y + 1),
                opts.layout.getLocation(X + 1, Y),
                opts.layout.getLocation(X - 1, Y)
            ).forEach(next => {
                if (next === undefined)
                    return;

                const NEXT_OPTS = Object.create(opts);
                NEXT_OPTS.location = next;
                NEXT_OPTS.previous = opts.location;
                NEXT_OPTS.step = opts.step + 1;
                NEXT_OPTS.orientation = CombatLogic.getOrientation(opts.location, next);

                SkillLogic._addPointPattern(range, NEXT_OPTS);
            });
        }
    }

    static _addEntityPattern(range, opts) {
        opts.entities.forEach(entity => {
            range.set(entity.location, {
                previous: opts.previous,
                isSelectable: true,
                color: opts.color
            });
        });
    }
}