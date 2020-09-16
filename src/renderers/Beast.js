class BeastRenderer extends Renderer {
    constructor(config) {
        super(config);
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

    nextAnimation(beast, animation, simulated) {
        let next = (simulated) ? beast.animationQueue[0] : beast.animationQueue.shift();

        // animation end event request
        if (!simulated && animation.event !== undefined)
            Events.dispatch(animation.event, beast);

        // start rendering at new destination because animation is complete
        if (animation.destination !== undefined && animation.destination !== beast.location)
            beast.location = animation.destination;

        // default to beast idle animation if nothing is left in the queue
        if (next === undefined)
            next = beast.getDefaultAnimation(animation);

        beast.orientation = next.orientation;

        if (!simulated)
            beast.animation = next;

        if (next.movement) {
            switch (next.destination.x - beast.location.x) {
                case 0:
                    Events.dispatch('sort', 'X');
                    break;
                default:
                    Events.dispatch('sort', 'Y');
            }

            if (next.swap)
                beast.location = next.destination;
        }

        return next;
    }

    nextFrame(beast, animation, simulated) {
        animation.px += animation.config[animation.frame].px || 0;
        animation.py += animation.config[animation.frame].py || 0;
        animation.pz += animation.config[animation.frame].pz || 0;

        animation.ms -= animation.config[animation.frame].ms;
        animation.frame += 1;

        if (animation.frame >= animation.config.length)
            return this.nextAnimation(beast, animation, simulated);

        return animation;
    }

    update(step, beasts, speed = this.speed) {
        beasts.forEach(beast => {
            let animation = beast.animation;
            animation.ms += (step * speed);
            while (animation.ms > animation.config[animation.frame].ms) {
                if (animation.config[animation.frame].event !== undefined)
                    Events.dispatch(animation.config[animation.frame].event, beast);
                animation = this.nextFrame(beast, beast.animation, false);
            }
        });
    }
    
    render(delta, ctx, camera, location, beast, scaling = this.scaling, speed = this.speed) {
        let animation = Object.create(beast.animation);
        while ((animation.ms + (delta * speed)) > animation.config[animation.frame].ms)
            animation = this.nextFrame(beast, animation, true);

        const frame = animation.config[animation.frame];

        let cx = 0,
            cy = 0,
            cz = 0;

        if (animation.movement) {
            const p  = Math.min(1, (animation.ms + (delta * speed)) / frame.ms),
                  d  = location.getZ() - animation.destination.getZ(),
                  px = animation.px + (p * (frame.px || 0)),
                  py = animation.py + (p * (frame.py || 0)),
                  pz = animation.pz + (p * (frame.pz || 0));

            // render from new destination
            if (pz !== 0 && (animation.destination !== location) && !animation.sloped && (pz >= 1 || d > 0))
                this.reverseLocation(beast, animation);

            cx = animation.ix + Math.round(px * (animation.tx - animation.ix));
            cy = animation.iy + Math.round(py * (animation.ty - animation.iy));
            cz = animation.iz + Math.round(pz * (animation.tz - animation.iz));
        }

        if (frame.idx === -1)
            return;

        const x = location.getPosX() - ((beast.tileset.tw - location.tw) / 2),
              y = location.getPosY() - ((beast.tileset.th - location.th) - (location.td / 2)) + (~~location.isSloped() * (location.th / 2)),
              ox = ~~animation.ox + ~~frame.ox + ~~cx,
              oy = ~~animation.oy + ~~frame.oy + ~~cy + ~~cz,
              translateX = camera.getPosX() + (x * scaling) + ox,
              translateY = camera.getPosY() + (y * scaling) + oy;

        this.renderToCanvas(ctx, beast, frame.idx, animation.mirrored, translateX, translateY, scaling);
    }

    renderEquipment(ctx, beast, idx, layer, isMirrored, translateX, translateY, scaling = this.scaling) {
        Object.values(beast.equipment.equipment).forEach(item => {
            if (item === null)
                return;

            const config = item.tileset.config[idx]?.[~~isMirrored];
            if (config === undefined || config.layer !== layer)
                return;

            ctx.save();
            ctx.translate(translateX + ((~~config.ox + (~~config.mirrored * item.tw)) * scaling), translateY + (~~config.oy * scaling));
    
            if (config.mirrored)
                ctx.scale(-1, 1);

            ctx.drawImage(
                item.tileset.img,
                (config.idx * item.tileset.tw) % item.tileset.width,
                Math.floor((config.idx * item.tileset.tw) / item.tileset.width) * (item.tileset.th),
                item.tileset.tw,
                item.tileset.th,
                0,
                0,
                item.tileset.tw * scaling,
                item.tileset.th * scaling
            );
            ctx.restore();
        });
    }

    renderToCanvas(ctx, beast, idx, isMirrored, translateX, translateY, scaling = this.scaling) {
        this.renderEquipment(ctx, beast, idx, -1, isMirrored, translateX, translateY, scaling);

        ctx.save();
        ctx.translate(translateX + (~~isMirrored * beast.tileset.tw * scaling), translateY);

        if (isMirrored)
            ctx.scale(-1, 1);
        
        ctx.drawImage(
            beast.tileset.img,
            (idx * beast.tileset.tw) % beast.tileset.width,
            Math.floor((idx * beast.tileset.tw) / beast.tileset.width) * beast.tileset.th,
            beast.tileset.tw,
            beast.tileset.th,
            0,
            0,
            beast.tileset.tw * scaling,
            beast.tileset.th * scaling
        );
        ctx.restore();

        this.renderEquipment(ctx, beast, idx, 1, isMirrored, translateX, translateY, scaling);
    }
}