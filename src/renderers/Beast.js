class BeastRenderer extends Renderer {
    constructor(config) {
        super(config);
    }

    reverseLocation(beast, animation) {
        beast.location = animation.destination;
        [animation.ix, animation.tx] = [-animation.tx, -animation.ix];
        [animation.iy, animation.ty] = [-animation.ty, -animation.iy];
        [animation.iz, animation.tz] = [-animation.tz, -animation.iz];
    }

    nextAnimation(beast, animation) {
        let next = beast.animationQueue.shift();

        // animation end event request
        if (animation.events?.end !== undefined)
            Events.dispatch(animation.events.end, beast);

        // start rendering at new destination because animation is complete
        if (animation.destination !== undefined && animation.destination !== beast.location)
            beast.location = animation.destination;

        // default to beast idle animation if nothing is left in the queue
        if (next === undefined)
            next = beast.getDefaultAnimation(animation);

        beast.animation = next;
        beast.orientation = next.orientation;
        if (next.events?.start !== undefined)
            Events.dispatch(next.events.start, beast);

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

    nextFrame(beast, animation) {
        animation.px += animation.config[animation.frame].px || 0;
        animation.py += animation.config[animation.frame].py || 0;
        animation.pz += animation.config[animation.frame].pz || 0;

        animation.ms -= animation.config[animation.frame].ms;
        animation.frame += 1;

        if (animation.frame >= animation.config.length)
            return this.nextAnimation(beast, animation);

        return animation;
    }

    update(step, beasts, speed = this.speed) {
        beasts.forEach(beast => {
            let animation = beast.animation;
            animation.ms += (step * speed);
            while (animation.ms > animation.config[animation.frame].ms) {
                if (animation.config[animation.frame].event !== undefined)
                    Events.dispatch(animation.config[animation.frame].event, beast);
                animation = this.nextFrame(beast, animation);
            }
        });
    }
    
    render(delta, ctx, camera, location, beast, scaling = this.scaling, speed = this.speed) {
        let animation = beast.animation;
        while ((animation.ms + (delta * speed)) > animation.config[animation.frame].ms)
            animation = this.nextFrame(beast, animation);

        const frame = animation.config[animation.frame];

        let cx = 0,
            cy = 0,
            cz = 0;

        if (animation.movement) {
            const p  = Math.max(0, Math.min(1, (animation.ms + (delta * speed)) / frame.ms)),
                  d  = beast.location.getZ() - animation.destination.getZ(),
                  px = animation.px + (p * (frame.px || 0)),
                  py = animation.py + (p * (frame.py || 0)),
                  pz = animation.pz + (p * (frame.pz || 0));

            // render from new destination
            if (pz !== 0 && (animation.destination !== beast.location) && !animation.sloped && (pz >= 1 || d > 0))
                this.reverseLocation(beast, animation);

            cx = animation.ix + Math.round(px * (animation.tx - animation.ix));
            cy = animation.iy + Math.round(py * (animation.ty - animation.iy));
            cz = animation.iz + Math.round(pz * (animation.tz - animation.iz));
        }

        // does delta change require rerender?
        if (location !== beast.location)
            return ['west', 'north'].includes(GeneralLogic.getOrientationTo(beast.location, location));

        if (frame.idx === -1)
            return false;

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