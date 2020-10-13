class BeastLogic {

    // -------------------------
    // ALLEGIANCES
    // ------------------------------------

    static ALLEGIANCES = {
        SELF: 'self',
        ALLY: 'ally',
        NEUTRAL: 'neutral',
        FOE: 'foe'
    };
    
    static getAllegiance(from, to) {
        if (from === to)
            return BeastLogic.ALLEGIANCES.SELF;
        
        const a1 = ~~from?.allegiance,
              a2 = ~~to?.allegiance,
              difference = Math.abs(a1 - a2);

        switch(difference) {
            case 0:
                return BeastLogic.ALLEGIANCES.ALLY;
            case 1:
                return BeastLogic.ALLEGIANCES.NEUTRAL;
            case 2:
                return BeastLogic.ALLEGIANCES.FOE;
        }
    }

    // ---------------------------
    // Movement
    // -----------------------------------

    static getRange(beast, scene) {
        return PathingLogic.getRange(scene, {
            location: beast.location,
            min: 1,
            max: beast.getRemainingMovement(),
            zUp: beast.stats.current.jump,
            zDown: beast.stats.current.jump + 1,
            selectableHazards: beast.canFly(),
            continueOnHazards: beast.canFly(),
            waterIsHazard: !beast.canSwim(),
            useHazardLeap: !beast.canFly(),
            hazardLeap: Math.floor(beast.stats.current.jump / 2)
        });
    }

    static getPath(location, range) {
        return PathingLogic.getPathTo(location, range);
    }

    static isInRange(location, range) {
        return !!range && range.has(location);
     }

    static isValidSelection(location, range) {
        return BeastLogic.isInRange(location, range) && range.get(location).isSelectable;
    }

    // ---------------------------
    // Animations
    // -----------------------------------

    static getAnimationConfig(unit, base, orientation) {
        orientation = orientation || unit.orientation;
        return unit.tileset.configuration[base][orientation];
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

    static getMovementAnimations(unit, path, destination, animationId = null) {
        let animations = new Array(),
            previous = unit.animations.queue[unit.animations.queue.length - 1] || unit.animations.current;
        
        if (unit.animations.checkpoint === null)
            unit.animations.checkpoint = previous;

        path.forEach(location => {
            const animation = new Object();
            animation.ms = 0;
            animation.frame = 0;
            animation.destination = location;
            animation.id = animationId;
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
                multiplier += ~~frame.zmult * Math.abs(location.z - previous.destination.z);
                multiplier += ~~frame.xmult * Math.abs(location.x - previous.destination.x);
                multiplier += ~~frame.ymult * Math.abs(location.y - location.y);
                animation.multipliers.push(Math.max(multiplier, 1));
            });

            animation.events = new Object();
            animation.events.end = {
                id: (location === destination) ? 'move-complete' : 'move-step', 
                data: {
                    unit,
                    animation,
                    previous: previous.destination
                }
            };

            animations.push(animation);
            previous = animation;
        });

        return animations;
    }

    static _addAnimationProperties(animation, start, end) {
        const o = CombatLogic.getOrientation(start, end),
              so = start.orientation,
              eo = end.orientation,
              oso = so ? CombatLogic.getOppositeOrientation(so) : undefined,
              oeo = eo ? CombatLogic.getOppositeOrientation(eo) : undefined,
              diff = Math.abs(end.x - start.x) + Math.abs(end.y - start.y),
              diff_z = end.z - start.z;
    
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

        const scaling = Game.views.settings.scaling;

        const w = (start.tw / 2) * scaling,
              d = (start.td / 2) * scaling,
              h = (start.th / 2) * scaling,
              x = (end.x - start.x),
              y = (end.y - start.y),
              z = (end.z - start.z),
              s = (~~end.isSloped) - (~~start.isSloped);

        const swap = (end.x > start.x || end.y > start.y) && ((z === 0 && s >= 0) || animation.sloped);

        // swap rendering location immediately on animation start
        animation.swap = swap;

        // derived initial and current offset
        animation.ix = animation.cx = ~~swap * ((x  - y) * w + (start.ox - end.ox));
        animation.iy = animation.cy = ~~swap * ((-x - y) * d + (start.oy - end.oy));
        animation.iz = animation.cz = ~~swap * (-(s * h) + (z * start.th * scaling));

        // derived target offset
        animation.tx = ~~!swap * ((y - x) * w - (start.ox - end.ox));
        animation.ty = ~~!swap * ((x + y) * d - (start.oy - end.oy));
        animation.tz = ~~!swap * ((s * h) - (z * start.th * scaling));

        // current movement progress
        animation.px = 0;
        animation.py = 0;
        animation.pz = 0;
    }
}