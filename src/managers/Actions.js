class ActionManager {
    constructor() {
        this.cinematicMode = false;
    }

    isCinematic() {
        return this.cinematicMode;
    }

    enableCinematicMode() {
        this.cinematicMode = true;
    }

    disableCinematicMode() {
        this.cinematicMode = false;
    }

    // -------------------
    // Unit Movement
    // ----------------------------

    addMovementProperties(animation, start, end) {
        const o = GeneralLogic.getOrientationTo(end, start),
              so = start.getOrientation(),
              eo = end.getOrientation(),
              oso = so ? GeneralLogic.getOppositeOrientation(so) : undefined,
              oeo = eo ? GeneralLogic.getOppositeOrientation(eo) : undefined,
              diff = Math.abs(end.x - start.x) + Math.abs(end.y - start.y),
              diff_z = end.getZ() - start.getZ();
    
        if (Math.abs(diff_z) <= 1 && (so !== undefined || eo !== undefined)) {
            animation.sloped |= (so === eo        && ((diff_z < 0 && oso == o) || (diff_z >  0 && so  == o)));
            animation.sloped |= (so === undefined && ((diff_z > 0 && eo  == o) || (diff_z == 0 && oeo == o)));
            animation.sloped |= (eo === undefined && ((diff_z < 0 && oso == o) || (diff_z == 0 && so  == o)));
        }

        animation.movement = true;
        animation.orientation = o;

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

    async move(unit, path) {
        const origin = unit.location,
              destination = path[0],
              distance = Math.abs(destination.x - origin.x) + Math.abs(destination.y - origin.y);

        const complete = (resolve) => {
            const id = Events.listen('move-complete', (actor) => {
                if (actor !== unit)
                    return;
                Events.remove('move-complete', id);
                resolve();
            }, true);
        };

        let previous = unit.animationQueue[unit.animationQueue.length - 1] || unit.animation;
        if (unit.checkpoint.animation === null)
            unit.checkpoint.animation = previous;

        path.reverse().forEach(location => {
            const animation = new Object();
            animation.ms = 0;
            animation.frame = 0;
            animation.destination = location;
            this.addMovementProperties(animation, previous.destination, animation.destination);

            const config = unit.getAnimationConfig(animation.id, animation.orientation);
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
            animation.events.end = 'move-step';
            if (location === destination)
                animation.events.end = 'move-complete';

            unit.animationQueue.push(animation);
            previous = animation;
        });

        unit.checkpoint.last += distance;
        unit.checkpoint.total += distance;

        return new Promise(complete);
    }

    resetMove(unit) {
        if (unit.checkpoint.animation === null)
            return;
        
        console.log(unit.checkpoint.animation, unit.checkpoint.animation.orientation, unit.checkpoint.animation.destination)
        unit.animation = unit.checkpoint.animation;
        unit.animation.ms = 0;
        unit.animation.frame = 0;
        unit.orientation = unit.checkpoint.animation.orientation;
        unit.location = unit.checkpoint.animation.destination;

        unit.checkpoint.animation = null;
        unit.checkpoint.total -= unit.checkpoint.last;
        unit.checkpoint.last = 0;
    }
}