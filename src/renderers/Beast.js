class BeastRenderer extends Renderer {
    constructor(config) {
        super(config);
    }

    _verifyAnimation(id, orientation) {
        const animation = new Object();
        animation.id = id;
        animation.orientation = this.meta[id][orientation] !== undefined ? orientation : this.orientation;
        animation.variation = this.meta[id][orientation].variation !== undefined;
        animation.meta = this.meta[id][orientation] || this.meta[id];

        return animation;
    }

    _setMovementType(animation, start, end) {
        const O   = Game.logic.general.getOrientationTo(end, start),
              SO  = start.getOrientation(),
              EO  = end.getOrientation(),
              OSO = SO ? Game.logic.general.getOppositeOrientation(SO) : undefined,
              OEO = EO ? Game.logic.general.getOppositeOrientation(EO) : undefined,
              DIFF = Math.abs(end.x - start.x) + Math.abs(end.y - start.y),
              DIFF_Z = end.getZ() - start.getZ();
          
        if (Math.abs(DIFF_Z) <= 1 && (SO !== undefined || EO !== undefined)) {
            animation.sloped |= (SO === EO        && ((DIFF_Z < 0 && OSO == O) || (DIFF_Z > 0  && SO  == O)));
            animation.sloped |= (SO === undefined && ((DIFF_Z > 0 && EO  == O) || (DIFF_Z == 0 && OEO == O)));
            animation.sloped |= (EO === undefined && ((DIFF_Z < 0 && OSO == O) || (DIFF_Z == 0 && SO  == O)));
        }

        animation.orientation = O;

        if (DIFF > 1 && Math.abs(DIFF_Z) <= 1)
            return 'leap';

        if (animation.sloped && DIFF <= 1)
            return 'walk';

        if (Math.abs(DIFF_Z) > 0)
            return (DIFF_Z > 0) ? 'jump-up' : 'jump-down';

        // at least one tile is a slope, but there is no z change if we're here
        if (SO !== undefined && EO !== undefined) {
            if (SO === EO && ![SO, OSO].includes(O))
                return 'walk';
            return (SO == O) ? 'jump-down' : 'jump-up';
        } else if (SO === undefined && EO === undefined) {
            return 'walk';
        }

        return (SO !== undefined) ? 'jump-up' : 'jump-down';
    }

    _setMovementData(animation, start, end) {
        const w    = (start.tw / 2) * 4,
              d    = (start.td / 2) * 4,
              h    = (start.th / 2) * 4,
              x    = (end.x - start.x),
              y    = (end.y - start.y),
              z    = (end.getZ() - start.getZ()),
              s    = (~~end.isSloped()) - (~~start.isSloped());

        const dist = Math.abs((end.x - start.x)) + Math.abs((end.y - start.y)),
              swap = (end.x > start.x || end.y > start.y) && ((z === 0 && s >= 0) || animation.sloped);

        // swap rendering location immediately on animation start
        animation.swap = swap;

        // derived initial and current offset
        animation.ix = animation.cx = ~~swap * ((x  - y) * w + (start.getOffsetX() - end.getOffsetX()));
        animation.iy = animation.cy = ~~swap * ((-x - y) * d + (start.getOffsetY() - end.getOffsetY()));
        animation.iz = animation.cz = ~~swap * (-(s * h) + (z * start.th * 4));

        // derived target offset
        animation.tx = ~~!swap * ((y - x) * w - (start.getOffsetX() - end.getOffsetX()));
        animation.ty = ~~!swap * ((x + y) * d - (start.getOffsetY() - end.getOffsetY()));
        animation.tz = ~~!swap * ((s * h) - (z * start.th * 4));

        // current movement progress
        animation.px = 0;
        animation.py = 0;
        animation.pz = 0;
    }

    _getAnimationData({ id, orientation = this.orientation, destination, event = null } = opts) {
        // need to derive animation and movement data
        const PREVIOUS = this.animationQueue[this.animationQueue.length - 1] || this.animation,
              START = PREVIOUS?.destination || this.location,
              END = destination || START;
        
        const animation = new Object();
        animation.id = id;
        animation.ms = 0;
        animation.frame = 0;
        animation.destination = END;
        animation.orientation = orientation;
        animation.event = event;

        if (id === null)
            animation.id = this._setMovementType(animation, START, END);
        
        Object.assign(animation, this._verifyAnimation(animation.id, animation.orientation));
        animation.variation &= !PREVIOUS?.variation && ['walk', 'idle'].includes(PREVIOUS?.id);

        if (END !== START)
            this._setMovementData(animation, START, END);

        animation.ox = ~~animation.meta.ox;
        animation.oy = ~~animation.meta.oy;
        animation.movement = START != END;

        return animation;
    }

    getAnimationData(id, orientation, destination, event) {
        const previous = this.animationQueue[animationQueue.length - 1] || this.animation,
              start = previous?.destination || this.location,
              end = destination || start;

        const animation = new Object();
        animation.id = id;
        animation.ms = 0;
        animation.frame = 0;
        animation.destination = end;
        animation.orientation = orientation;
        animation.events = new Array();
        if (event !== undefined)
            animation.events.push(event);

        this.addAnimationConfig(animation, this.getAnimationId(animation, start, end), animation.orientation, start, end, previous);

        if (end !== start)
            this.setMovementData(animation, start, end);

        return animation;
    }

    reverseLocation(beast, animation) {
        beast.location = animation.destination;
        [animation.ix, animation.tx] = [-animation.tx, -animation.ix];
        [animation.iy, animation.ty] = [-animation.ty, -animation.iy];
        [animation.iz, animation.tz] = [-animation.tz, -animation.iz];
    }

    nextAnimation(beast, animation, next, animationEvent) {
        const ms = animation.ms,
              next = beast.animationQueue.shift();

        // animation end event request
        if (animationEvent !== undefined)
            Events.dispatch(animationEvent, beast);

        // start rendering at new destination because animation is complete
        if (animation.destination !== undefined && animation.destination !== beast.location)
            beast.location = animation.destination;

        // default to beast idle animation if nothing is left in the queue
        if (next === undefined) {
            next = new Object();
            next.ms = ms;
            next.movement = false;
            next.frame = 0;
            next.orientation = beast.orientation;
            next.variation = !animation.variation;
            this.addAnimationConfig(next, 'idle', animation.orientation, beast.location, beast.location, animation);
        } else {
            beast.orientation = next.orientation;
        }

        beast.animation = next;

        if (beast.animation.movement) {
            // swap render sorting depending on which way the beast will be moving
            switch(beast.animation.destination.x - beast.location.x) {
                case 0:
                    Events.dispatch('sort', 'X');
                    break;
                default:
                    Events.dispatch('sort', 'Y');
            }

            if (beast.animation.swap)
                beast.location = beast.animation.destination;
        }
    }

    nextFrame(beast, isDelta = false) {
        let animation;
        if (isDelta) {
            animation = Object.create(beast.animation);
        } else {
            animation = beast.animation;
            if (animation.config[animation.frame].event !== undefined)
                Events.dispatch(animation.config[animation.frame].event, beast);
        }

        animation.px += animation.config[animation.frame].px || 0;
        animation.py += animation.config[animation.frame].py || 0;
        animation.pz += animation.config[animation.frame].pz || 0;

        animation.ms -= animation.config[animation.frame].ms;
        animation.frameNo += 1;

        if (animation.frame >= animation.config.length) {
            if (isDelta)
                return this.nextAnimation(beast, animation, beast.animationQueue[0]);
            return this.nextAnimation(beast, animation, beast.animationQueue.shift(), animation.event);
        }

        return animation;
    }

    update(step, beasts) {
        beasts.forEach(beast => {
            beast.animation.ms += step;
            while (beast.animation.ms > beast.animation.config[beast.animation.frame].ms)
                this.nextFrame(beast, false);
        });
    }
    
    render(delta, ctx, camera, location, beast) {
        let animation = new Object(beast.animation);

        while ((animation.ms + delta) > animation.config[animation.frame].ms)
            animation = this.nextFrame(beast, true);

        const meta = animation.config[animation.frame];

        let cx = 0,
            cy = 0,
            cz = 0;

        if (animation.movement) {
            const p  = Math.min(1, (animation.ms + delta) / meta.ms),
                  d  = location.getZ() - animation.destination.getZ(),
                  px = animation.px + (p * (meta.px || 0)),
                  py = animation.py + (p * (meta.py || 0)),
                  pz = animation.pz + (p * (meta.pz || 0));

            // render from new destination
            if (pz !== 0 && (animation.destination !== location) && !animation.sloped && (pz >= 1 || d > 0))
                this.reverseLocation(beast, animation);

            cx = animation.ix + Math.round(px * (animation.tx - animation.ix));
            cy = animation.iy + Math.round(py * (animation.ty - animation.iy));
            cz = animation.iz + Math.round(pz * (animation.tz - animation.iz));
        }

        if (meta.idx === -1)
            return;

        const x = location.getPosX() - ((beast.tw - location.tw) / 2) + (~~animation.mirrored * beast.tw),
              y = location.getPosY() - ((beast.th - location.th) - (location.td / 2)) + (~~location.isSloped() * (location.th / 2)),
              ox = ~~animation.ox + ~~meta.ox + ~~cx,
              oy = ~~animation.oy + ~~meta.oy + ~~cy + ~~cz;
              
        // this.equipment.render(ctx, -1, meta.idx, animation.mirrored, X + OFFSET_X, Y + OFFSET_Y);

        ctx.save();
        ctx.translate(camera.getPosX() + (x * this.scaling) + ox, camera.getPosY() + (y * this.scaling) + oy);

        if (animation.mirrored)
            ctx.scale(-1, 1);

        ctx.drawImage(
            beast.tileset.img,
            (meta.idx * beast.tw) % beast.tileset.width,
            Math.floor((meta.idx * beast.tw) / beast.tileset.width) * beast.th,
            beast.tw,
            beast.th,
            0,
            0,
            beast.tw * this.scaling,
            beast.th * this.scaling
        );
        ctx.restore();

        // this.equipment.render(ctx, 1, meta.idx, animation.mirrored, (x * this.scaling) + ox, (y * this.scaling) + oy);
    }
}