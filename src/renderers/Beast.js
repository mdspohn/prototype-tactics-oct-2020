class BeastRenderer {
    static update(beasts, ms, { speed = 1, scaling = 1 } = settings) {
        beasts.forEach(beast => {

            // ------------------------------
            // Animation
            // ------------------------------

            let animation = beast.animations.current;
            ms *= speed;

            animation.ms += ms;

            if (animation.terminate)
                animation = BeastRenderer.nextAnimation(beast, animation, true);

            while (animation.ms > (animation.config[animation.frame].ms * animation.multipliers[animation.frame]))
                animation = BeastRenderer.nextFrame(beast, animation);

            if (animation.movement) {
                const frame = animation.config[animation.frame],
                      p  = animation.ms / (frame.ms * animation.multipliers[animation.frame]),
                      d  = beast.location.z - animation.destination.z,
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

            // ------------------------------
            // Filter Effects
            // ------------------------------

            Object.values(beast.filters).forEach(filter => {
                if (filter.ms === filter.duration && filter.value === filter.target)
                    return;
                    
                filter.ms = Math.min(filter.ms + ms, filter.duration);
                filter.value = filter.initial + ((filter.target - filter.initial) * (filter.ms / filter.duration));

                if (filter.ms === filter.duration)
                    Events.dispatch(filter.type + '-filter-complete', { unit: beast });
            });

            // ------------------------------
            // Text Effects
            // ------------------------------

            if (beast.text.length > 0) {
                const completed = new Array();
                beast.text.forEach((blurb, index) => {
                    blurb.ms += ms;
                    const percentage = Math.min(Math.max(blurb.ms, 0) / blurb.duration, 1);
                    blurb.ox = blurb.initial.x + ((blurb.target.x - blurb.initial.x) * percentage);
                    blurb.oy = blurb.initial.y + ((blurb.target.y - blurb.initial.y) * percentage);

                    if (blurb.ox === blurb.target.x && blurb.oy === blurb.target.y) {
                        completed.push(index);
                    }
                });
                completed.sort((a, b) => b - a);
                completed.forEach(index => beast.text.splice(index, 1));
            }
        });
    }
    
    static render(beast, location, { scaling = 1 } = settings) {
        const animation = beast.animations.current,
              frame = animation.config[animation.frame];

        if (frame.idx === -1)
            return false;

        const x = location.posX - ((beast.tileset.sw - location.tw) / 2),
              y = location.posY - (beast.tileset.sh - location.td) + (~~location.isSloped * (location.th / 2)),
              ox = ~~animation.x + ~~frame.ox,
              oy = ~~animation.y + ~~frame.oy,
              translateX = Game.camera.getPosX() + ((x + ox) * scaling) + ~~animation.cx,
              translateY = Game.camera.getPosY() + ((y + oy) * scaling) + ~~animation.cy + ~~animation.cz;

        BeastRenderer.renderCustom(Game.ctx, beast, frame.idx, animation.mirrored, translateX, translateY, { scaling });
    }

    static nextFrame(beast, animation) {
        if (animation.config[animation.frame].event)
            Events.dispatch(animation.config[animation.frame].event, { unit: beast, animation } );

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

        Object.assign(next, { ms: animation.ms * ~~!isForced })

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
        EquipmentRenderer.render(ctx, beast, index, isMirrored, -1, translateX, translateY, { scaling });
        ctx.save();
        ctx.translate(translateX + (~~isMirrored * beast.tileset.sw * scaling), translateY);

        let filters = '';
        Object.values(beast.filters).forEach(filter => {
            if (filter.base === filter.value)
                return;

            filters += `${filter.type}(${filter.value}${filter.suffix}) `;
        });
        
        ctx.filter = filters;

        if (beast.text.length > 0) {
            const animation = beast.animations.current,
                  frame = animation.config[animation.frame];
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            beast.text.forEach(blurb => {
                ctx.font = `${blurb.fontSize}px Equipment`;
                const ox = blurb.ox + ((beast.tileset.sw / 2) - (~~isMirrored * beast.tileset.sw) - (~~animation.x + ~~frame.ox)) * scaling - (5 * (blurb.fontSize / 10)),
                      oy = blurb.oy - (~~animation.y + ~~frame.oy) * scaling;
                ctx.strokeText(blurb.text, ox, oy);
                ctx.fillText(blurb.text, ox, oy);
            });
        }

        if (isMirrored)
            ctx.scale(-1, 1);
        
        ctx.drawImage(
            beast.tileset.img,
            (index * beast.tileset.sw) % beast.tileset.width,
            Math.floor((index * beast.tileset.sw) / beast.tileset.width) * beast.tileset.sh,
            beast.tileset.sw,
            beast.tileset.sh,
            0,
            0,
            beast.tileset.sw * scaling,
            beast.tileset.sh * scaling
        );
        ctx.restore();
        EquipmentRenderer.render(ctx, beast, index, isMirrored, 1, translateX, translateY, { scaling });
    }
}