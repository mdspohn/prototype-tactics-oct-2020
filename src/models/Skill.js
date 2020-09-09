class Skill {
    constructor(config) {

        // --------------------
        // RANGE
        // ------------------------------

        this.range = new Object();
        // @range.min <Integer>
        this.range.min = ~~config.range?.min;
        // @range.max <Integer>
        this.range.max = config.range?.max;
        // @range.z <Integer>
        this.range.z = ~~config.range?.z;
        // @range.pattern <String> >> 'POINT', 'ALL', 'ALLY', 'ENEMY'
        this.range.pattern = config.range.pattern;

        // --------------------
        // TARGET
        // ------------------------------

        this.target = new Object();
        // @target.min <Integer>
        this.target.min = ~~config.target?.min;
        // @target.max <Integer>
        this.target.max = config.target?.max;
        // @target.z <Integer>
        this.target.z = ~~config.target?.z;
        // @target.pattern <String> >> 'POINT', 'ALL', 'CONCURRENT'
        this.target.pattern = config.target.pattern;

        // --------------------
        // DAMAGE MODIFIERS [% damage modifier from stats] <Integer>
        // ------------------------------

        this.modifiers = new Object();
        this.modifiers.attack  = ~~config.modifiers?.attack  / 100;
        this.modifiers.defense = ~~config.modifiers?.defense / 100;
        this.modifiers.magic   = ~~config.modifiers?.magic   / 100;
        this.modifiers.resist  = ~~config.modifiers?.resist  / 100;

        this.modifiers.strength     = ~~config.modifiers?.strength     / 100;
        this.modifiers.dexterity    = ~~config.modifiers?.dexterity    / 100;
        this.modifiers.intelligence = ~~config.modifiers?.intelligence / 100;
        this.modifiers.mind         = ~~config.modifiers?.mind         / 100;
        this.modifiers.vitality     = ~~config.modifiers?.vitality     / 100;

        // --------------------
        // BUFFS [% chance of buff] <Integer>
        // ------------------------------

        this.buffs = new Object();
        this.buffs.regen = ~~config.buffs?.regen / 100;
        this.buffs.haste = ~~config.buffs?.haste / 100;

        // --------------------
        // DEBUFFS [% chance of debuff] <Integer>
        // ------------------------------

        this.debuffs = new Object();
        this.debuffs.poison = ~~config.debuffs?.poison / 100;
        this.debuffs.slow   = ~~config.debuffs?.slow   / 100;

        // --------------------
        // ANIMATION & MOVEMENT
        // ------------------------------
    }

    _addPointPattern(range, opts) {
        if (!range.has(opts.location) || range.get(opts.location).step > opts.step) {

            // location restrictions
            if (opts.restrictions != null && (!opts.restrictions.has(opts.location) || !opts.restrictions.get(opts.location).isSelectable))
                return;
            
            // z-axis restrictions
            if (opts.previous != null && opts.z != null && Math.abs(opts.location.z() - opts.previous.z()) > opts.z)
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
                NEXT_OPTS.orientation = Util.getOrientationTo(opts.location, next);

                this._addPointPattern(range, NEXT_OPTS);
            });
        }
    }

    _addCardinalPattern(range, opts) {
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
            if (opts.z != null && Math.abs(next.z() - previous.z()) > opts.z)
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
                range.set(WEST, { orientation: Util.ORIENTATIONS.WEST, previous: PREVIOUS_WEST,  isSelectable: i >= opts.min, color: opts.color });
                PREVIOUS_WEST = WEST;
            } else {
                PREVIOUS_WEST = null;
            }
            if (passesRestrictions(PREVIOUS_EAST, EAST)) {
                range.set(EAST, { orientation: Util.ORIENTATIONS.EAST, previous: PREVIOUS_EAST,  isSelectable: i >= opts.min, color: opts.color });
                PREVIOUS_EAST = EAST;
            } else {
                PREVIOUS_EAST = null;
            }
            if (passesRestrictions(PREVIOUS_SOUTH, SOUTH)) {
                range.set(SOUTH, { orientation: Util.ORIENTATIONS.SOUTH, previous: PREVIOUS_SOUTH,  isSelectable: i >= opts.min, color: opts.color });
                PREVIOUS_SOUTH = SOUTH;
            } else {
                PREVIOUS_SOUTH = null;
            }
            if (passesRestrictions(PREVIOUS_NORTH, NORTH)) {
                range.set(NORTH, { orientation: Util.ORIENTATIONS.NORTH, previous: PREVIOUS_NORTH,  isSelectable: i >= opts.min, color: opts.color });
                PREVIOUS_NORTH = NORTH;
            } else {
                PREVIOUS_NORTH = null;
            }
        }
    }

    _addFillPattern(range, opts) {
        opts.layout.forEach(location => {
            if (!opts.restrictions.has(location))
                return;
            const config = Object.create(opts.restrictions.get(location));
            config.color = opts.color;

            range.set(location, config);
        });
    }

    _addConcurrentPattern(range, opts) {
        if (!range.has(opts.location) || range.get(opts.location).step > opts.step) {

            // location restrictions
            if (!opts.restrictions.has(opts.location) || !opts.restrictions.get(opts.location).isSelectable)
                return;
            
            // z-axis restrictions
            if (opts.previous != null && opts.z != null && Math.abs(opts.location.z() - opts.previous.z()) > opts.z)
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
                NEXT_OPTS.orientation = Util.getOrientationTo(opts.location, next);

                this._addPointPattern(range, NEXT_OPTS);
            });
        }
    }

    _addEntityPattern(range, opts) {
        opts.entities.forEach(entity => {
            range.set(entity.location, {
                previous: opts.previous,
                isSelectable: true,
                color: opts.color
            });
        });
    }

    _addPattern(id, range, opts) {
        switch(id) {
            case 'POINT':
                this._addPointPattern(range, opts);
                break;
            case 'CARDINAL':
                this._addCardinalPattern(range, opts);
                break;
            case 'FILL':
                this._addFillPattern(range, opts);
                break;
            case 'CONCURRENT':
                this._addConcurrentPattern(range, opts);
                break;
            case 'ENTITIES':
                this._addEntityPattern(range, opts);
                break;
            default:
                return console.warn('Skill pattern not found: ', id);
        }
    }

    getRange(attacker, entities, layout) {
        const range = new WeakMap();
        this._addPattern(this.range.pattern, range, {
            location: attacker.location,
            orientation: null,
            entities: entities,
            layout: layout,
            restrictions: null,
            previous: null,
            step: 0,
            min: ~~this.range.min,
            max: this.range.max,
            z: this.range.z,
            color: 'white',
            includeHazards: true, // XXX account for movement skills
            includeEntities: true // XXX account for movement skills
        });
        return range;
    }

    getTarget(location, entities, layout, range = null) {
        const selection = new WeakMap();
        this._addPattern(this.target.pattern, selection, {
            location: location,
            orientation: null,
            entities: entities,
            layout: layout,
            restrictions: range,
            previous: null,
            step: 0,
            min: ~~this.target.min,
            max: this.target.max,
            z: this.target.z,
            color: 'red',
            //secondary: 'yellow',
            includeHazards: true, // XXX account for movement skills
            includeEntities: true // XXX account for movement skills
        });
        return selection;
    }
}