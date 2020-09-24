class BeastRenderer {
    static update(beasts, ms, isDeltaUpdate, { speed = 1, scaling = 1 } = settings) {
        beasts.forEach(beast => {
            const adjustedMs = ms * speed;
            let animation = beast.animations.current;

            animation.ms += ~~!isDeltaUpdate * adjustedMs;
            animation.delta = ~~isDeltaUpdate * adjustedMs;

            if (animation.terminate)
                animation = BeastRenderer.nextAnimation(beast, animation, true);

            while ((animation.ms + animation.delta) > (animation.config[animation.frame].ms * animation.multipliers[animation.frame]))
                animation = BeastRenderer.nextFrame(beast, animation);

            if (isDeltaUpdate && animation.movement) {
                const frame = animation.config[animation.frame],
                      p  = (animation.ms + animation.delta) / (frame.ms * animation.multipliers[animation.frame]),
                      d  = beast.location.getZ() - animation.destination.getZ(),
                      px = animation.px + (p * (frame.px || 0)),
                      py = animation.py + (p * (frame.py || 0)),
                      pz = animation.pz + (p * (frame.pz || 0));
    
                // render from new destination
                if (pz !== 0 && (animation.destination !== beast.location) && !animation.sloped && (pz >= 1 || d > 0)) {
                    beast.location = animation.destination;
                    [animation.ix, animation.tx] = [-animation.tx, -animation.ix];
                    [animation.iy, animation.ty] = [-animation.ty, -animation.iy];
                    [animation.iz, animation.tz] = [-animation.tz, -animation.iz];
                }

                animation.cy = animation.iy + Math.round(py * (animation.ty - animation.iy));
                animation.cx = animation.ix + Math.round(px * (animation.tx - animation.ix));

                if ((px === py) && (Math.abs(animation.ty - animation.iy) * 2) === Math.abs(animation.tx - animation.ix))
                    animation.cx = Math.sign(animation.cx) * Math.sign(animation.cy) * animation.cy * 2;

                animation.cx += Math.round(p * ~~animation.intx * scaling);
                animation.cy += Math.round(p * ~~animation.inty * scaling);
                animation.cz = animation.iz + Math.round(pz * (animation.tz - animation.iz));
            }
        });
    }
    
    static render(beast, location, { scaling = 1 } = settings) {
        const animation = beast.animations.current,
              frame = animation.config[animation.frame];

        if (frame.idx === -1)
            return false;

        const x = location.getPosX() - ((beast.tileset.tw - location.tw) / 2),
              y = location.getPosY() - ((beast.tileset.th - location.th) - (location.td / 2)) + (~~location.isSloped() * (location.th / 2)),
              ox = ~~animation.x + ~~frame.ox,
              oy = ~~animation.y + ~~frame.oy,
              translateX = Game.camera.getPosX() + ((x + ox) * scaling) + ~~animation.cx,
              translateY = Game.camera.getPosY() + ((y + oy) * scaling) + ~~animation.cy + ~~animation.cz;

        BeastRenderer.renderCustom(Game.ctx, beast, frame.idx, animation.mirrored, translateX, translateY, { scaling });
    }

    static nextFrame(beast, animation) {
        if (animation.config[animation.frame].event)
            Events.dispatch(animation.config[animation.frame].event, beast);

        animation.px += animation.config[animation.frame].px || 0;
        animation.py += animation.config[animation.frame].py || 0;
        animation.pz += animation.config[animation.frame].pz || 0;

        // make interpolated frame offset the baseline for the next frame
        animation.x = ~~animation.ox + ~~animation.config[animation.frame].intx;
        animation.y = ~~animation.oy + ~~animation.config[animation.frame].inty;

        animation.ms -= animation.config[animation.frame].ms * animation.multipliers[animation.frame];
        animation.frame += 1;

        if (animation.frame >= animation.config.length) {
            return BeastRenderer.nextAnimation(beast, animation);
        } else {
            animation.intx = (~~animation.ox + ~~animation.config[animation.frame].intx) - animation.x;
            animation.inty = (~~animation.oy + ~~animation.config[animation.frame].inty) - animation.y;
        }

        return animation;
    }

    static nextAnimation(beast, animation, isForced = false) {
        let next = beast.animations.queue.shift();

        if (animation.events?.end !== undefined)
            Events.dispatch(animation.events.end.id, animation.events.end.data);

        if (animation.destination !== undefined && animation.destination !== beast.location && !isForced)
            beast.location = animation.destination;

        if (next === undefined)
            next = BeastLogic.getDefaultAnimation(beast, animation);

        Object.assign(next, { ms: animation.ms * ~~!isForced, delta: animation.delta * ~~!isForced })

        beast.animations.current = next;
        beast.orientation = next.orientation;

        if (next.events?.start !== undefined)
            Events.dispatch(next.events.start.id, next.events.start.data);

        if (next.movement) {
            switch (next.destination.x - beast.location.x) {
                case 0:
                    Events.dispatch('sort', 'X');
                    break;
                default:
                    Events.dispatch('sort', 'Y');
            }

            next.sorted = true;

            if (next.swap)
                beast.location = next.destination;
        }

        return next;
    }

    static renderCustom(ctx, beast, index, isMirrored, translateX, translateY, { scaling = 1 } = settings) {
        EquipmentRenderer.render(ctx, beast, -1, translateX, translateY, { scaling });
        ctx.save();
        ctx.translate(translateX + (~~isMirrored * beast.tileset.tw * scaling), translateY);

        if (isMirrored)
            ctx.scale(-1, 1);
        
        ctx.drawImage(
            beast.tileset.img,
            (index * beast.tileset.tw) % beast.tileset.width,
            Math.floor((index * beast.tileset.tw) / beast.tileset.width) * beast.tileset.th,
            beast.tileset.tw,
            beast.tileset.th,
            0,
            0,
            beast.tileset.tw * scaling,
            beast.tileset.th * scaling
        );
        ctx.restore();
        EquipmentRenderer.render(ctx, beast, 1, translateX, translateY, { scaling });
    }
}