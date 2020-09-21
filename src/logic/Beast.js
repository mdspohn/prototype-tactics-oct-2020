class BeastLogic {

    // --------------------
    // Status
    // ---------------------------
    
    static isAlive(unit) {
        return unit.health > 0;
    }

    // ---------------------------
    // Movement
    // -----------------------------------

    static isInRange(location, range) {
        return !!range && range.has(location);
     }

    static isValidSelection(location, range) {
        return BeastLogic.isInRange(location, range) && range.get(location).isSelectable;
    }

    static getPath(location, range) {
        let path = new Array(),
            next = location;

        while (range.get(next) !== undefined && range.get(next).previous instanceof Location) {
            path.unshift(next);
            next = range.get(next).previous;
        }

        return path;
    }

    static getRange(unit, entities, map) {
        const range = new WeakMap(),
              opts = new Object();

        opts.previous = undefined;
        opts.distance = unit.getMovement();
        opts.steps = 0;
        opts.hazardLeap = Math.floor(unit.jump / 2);

        BeastLogic._populateRange(range, unit.location, map, unit, entities, opts);

        return range;
    }

    static _populateRange(range, location, map, unit, entities, opts) {
        if (!range.has(location) || range.get(location).steps > opts.steps) {
            const occupant = entities.find(entity => entity.location === location),
                  allegiance = CombatLogic.getAllegiance(unit, occupant);
            
            // check if tile should be considered a hazard to possibly jump over
            let isHazard = false;
            isHazard |= location.getZ() === 0 && !unit.canFloat() && !unit.canFly();
            isHazard |= location.isWater() && !unit.canSwim() && !unit.canFly();

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
            config.canPass = [CombatLogic.ALLEGIANCES.SELF, CombatLogic.ALLEGIANCES.ALLY].includes(allegiance) || unit.canFly() || unit.canPhase();
            config.color = 'white';

            range.set(location, config);

            if (opts.steps >= opts.distance)
                return;

            Array.of(
                map.getLocation(location.x, location.y - 1),
                map.getLocation(location.x, location.y + 1),
                map.getLocation(location.x + 1, location.y),
                map.getLocation(location.x - 1, location.y)
            ).forEach(next => {
                if (next === undefined)
                    return;

                if (config.isHazard && ((CombatLogic.getOrientation(location, next) != CombatLogic.getOrientation(opts.previous, location)) || !config.canLeap))
                    return;

                const zDiff = next.getZ() - location.getZ();
                if (zDiff < (-unit.jump - 1) || zDiff > unit.jump)
                    return;
                
                this._populateRange(range, next, map, unit, entities, {
                    previous: location,
                    distance: opts.distance,
                    steps: opts.steps + 1,
                    hazardLeap: (isHazard) ? (opts.hazardLeap - (1 * isHazard)) : Math.floor(unit.jump / 2)
                });
            });
        }
    }

    // ---------------------------
    // Animations
    // -----------------------------------

    static getAnimationConfig(unit, base, orientation) {
        orientation = orientation || unit.orientation;
        return unit.tileset.config[base][orientation];
    }

    static getDefaultAnimation(unit, previous = null) {
        const animation = new Object(),
              config = BeastLogic.getAnimationConfig(unit, 'idle', unit.orientation);

        animation.id = 'idle';
        animation.variation = !previous?.variation;
        animation.mirrored = Boolean(config.mirrored);
        animation.config = (animation.variation && config.variation !== undefined) ? config.variation : config.frames;
        animation.ms = previous?.ms || 0;
        animation.multipliers = new Array(animation.config.length).fill(1);
        animation.frame = 0;
        animation.destination = unit.location;
        animation.orientation = unit.orientation;
        animation.movement = false;
        animation.events = new Object();
        animation.x = animation.ox = ~~config.ox;
        animation.y = animation.oy = ~~config.oy;

        return animation;
    }

    static getMovementAnimations(unit, path, destination, customAnimation) {
        let animations = new Array(),
            previous = unit.animationQueue[unit.animationQueue.length - 1] || unit.animation;
        
        if (unit.checkpoint.animation === null)
            unit.checkpoint.animation = previous;

        path.forEach(location => {
            const animation = new Object();
            animation.ms = 0;
            animation.frame = 0;
            animation.destination = location;
            animation.id = customAnimation;
            BeastLogic._addAnimationProperties(animation, previous.destination, animation.destination);

            const config = BeastLogic.getAnimationConfig(unit, animation.id, animation.orientation);
            animation.mirrored = Boolean(config.mirrored);
            animation.variation = !previous.variation;
            animation.x = animation.ox = ~~config.ox;
            animation.y = animation.oy = ~~config.oy;
            animation.config = (animation.variation && config.variation) ? config.variation : config.frames;

            // ms multipliers for frames that want it
            animation.multipliers = new Array();
            animation.config.forEach(frame => {
                let multiplier = 0;
                multiplier += ~~frame.zmult * Math.abs(location.getZ() - previous.destination.getZ());
                multiplier += ~~frame.xmult * Math.abs(location.x - previous.destination.x);
                multiplier += ~~frame.ymult * Math.abs(location.y - location.y);
                animation.multipliers.push(Math.max(multiplier, 1));
            });

            animation.events = new Object();
            animation.events.end = { id: 'move-step', data: animation };
            if (location === destination)
                animation.events.end = { id: 'move-complete', data: unit };

            animations.push(animation);
            previous = animation;
        });

        return animations;
    }

    static _addAnimationProperties(animation, start, end) {
        const o = CombatLogic.getOrientation(start, end),
              so = start.getOrientation(),
              eo = end.getOrientation(),
              oso = so ? CombatLogic.getOppositeOrientation(so) : undefined,
              oeo = eo ? CombatLogic.getOppositeOrientation(eo) : undefined,
              diff = Math.abs(end.x - start.x) + Math.abs(end.y - start.y),
              diff_z = end.getZ() - start.getZ();
    
        if (Math.abs(diff_z) <= 1 && (so !== undefined || eo !== undefined)) {
            animation.sloped |= (so === eo        && ((diff_z < 0 && oso == o) || (diff_z >  0 && so  == o)));
            animation.sloped |= (so === undefined && ((diff_z > 0 && eo  == o) || (diff_z == 0 && oeo == o)));
            animation.sloped |= (eo === undefined && ((diff_z < 0 && oso == o) || (diff_z == 0 && so  == o)));
        }

        animation.movement = true;
        animation.orientation = o;

        if (animation.id === null) {
            if (diff > 1 && Math.abs(diff_z) <= 1) {
                animation.id = 'leap';
            } else if (animation.sloped && diff <= 1) {
                animation.id = 'walk';
            } else if (Math.abs(diff_z) > 0) {
                animation.id = (diff_z > 0) ? 'jump-up' : 'jump-down';
            } else if (so !== undefined && eo !== undefined) {
                animation.id = (so === eo && ![so, oso].includes(o)) ? 'walk' : (so == o) ? 'jump-down' : 'jump-up';
            } else if (so === undefined && eo === undefined) {
                animation.id = 'walk';
            } else {
                animation.id = (so !== undefined) ? 'jump-up' : 'jump-down';
            }
        }

        const scaling = Game.views.getMapRenderer().getScaling();

        const w = (start.tw / 2) * scaling,
              d = (start.td / 2) * scaling,
              h = (start.th / 2) * scaling,
              x = (end.x - start.x),
              y = (end.y - start.y),
              z = (end.getZ() - start.getZ()),
              s = (~~end.isSloped()) - (~~start.isSloped());

        const swap = (end.x > start.x || end.y > start.y) && ((z === 0 && s >= 0) || animation.sloped);

        // swap rendering location immediately on animation start
        animation.swap = swap;

        // derived initial and current offset
        animation.ix = animation.cx = ~~swap * ((x  - y) * w + (start.getOffsetX() - end.getOffsetX()));
        animation.iy = animation.cy = ~~swap * ((-x - y) * d + (start.getOffsetY() - end.getOffsetY()));
        animation.iz = animation.cz = ~~swap * (-(s * h) + (z * start.th * scaling));

        // derived target offset
        animation.tx = ~~!swap * ((y - x) * w - (start.getOffsetX() - end.getOffsetX()));
        animation.ty = ~~!swap * ((x + y) * d - (start.getOffsetY() - end.getOffsetY()));
        animation.tz = ~~!swap * ((s * h) - (z * start.th * scaling));

        // current movement progress
        animation.px = 0;
        animation.py = 0;
        animation.pz = 0;
    }
}