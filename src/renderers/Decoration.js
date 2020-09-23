class DecorationRenderer {
    constructor() {

    }

    nextAnimation(tile, decorations) {
        const config = decorations.getTileConfig(tile.animation.next);
        tile.id = tile.animation.next;
        tile.idx = config.idx;
        tile.mirror = Boolean(config.mirror);
        tile.ox = 0;
        tile.oy = 0;
    }

    nextFrame(tile, decorations) {
        if (tile.animation.next !== null)
            this.nextAnimation(tile, decorations);

        const config = decorations.getTileConfig(tile.id);

        if (config.frames !== undefined) {
            tile.animation.ms -= config.frames[tile.animation.frame].ms;
            tile.animation.frame = (tile.animation.frame + 1) % config.frames.length;

            const frameConfig = config.frames[tile.animation.frame];
            tile.animation.next = (frameConfig.next !== undefined) ? frameConfig.next : null;
            tile.idx = frameConfig.idx;
            tile.ox = ~~frameConfig.ox;
            tile.oy = ~~frameConfig.oy;
        } else {
            tile.animation = null;
        }

        tile.ox += ~~config.ox;
        tile.oy += ~~config.oy;

        return tile;
    }

    update(step, decorations, speed) {
        decorations.tiles.forEach(row => {
            row.forEach(col => {
                col.forEach(tile => {
                    if (tile.animation === null)
                        return;
                    tile.animation.ms += (step * speed);
                    while (tile.animation.ms > decorations.getTileConfig(tile.id).frames[tile.animation.frame].ms)
                        this.nextFrame(tile, decorations);
                });
            });
        });
    }

    render(delta, ctx, camera, location, decorations, speed, scaling) {
        const tiles = decorations.tiles[location.getX()]?.[location.getY()];
        if (tiles === undefined)
            return;
        
        tiles.forEach((tile, z) => {
            while (tile.animation !== null && ((tile.animation.ms + (delta * speed)) > decorations.getTileConfig(tile.id).frames[tile.animation.frame].ms))
                tile = this.nextFrame(tile, decorations, true);

            if (tile.idx === -1)
                return;

            const IS_MIRRORED = decorations.getTileConfig(tile.id).mirrored,
                  POS_X = (~~IS_MIRRORED * decorations.getTileWidth()) - (location.getPosX()) - ((decorations.getTileWidth() - location.getTileWidth()) / 2),
                  POS_Y = (location.getPosY()) - (decorations.getTileHeight() - location.getTileDepth() - location.getTileHeight()) - (decorations.getTileHeight() * z);
          
            ctx.save();
            ctx.translate(camera.getPosX() - (POS_X * scaling), camera.getPosY() + (POS_Y * scaling));

            if (IS_MIRRORED)
                ctx.scale(-1, 1);

            ctx.drawImage(
                decorations.getImage(),
                (tile.idx * decorations.getTileWidth()) % decorations.getImageWidth(),
                Math.floor((tile.idx * decorations.getTileWidth()) / decorations.getImageWidth()) * (decorations.getTileHeight()),
                decorations.getTileWidth(),
                decorations.getTileHeight(),
                scaling * tile.ox,
                scaling * tile.oy,
                scaling * decorations.getTileWidth(),
                scaling * decorations.getTileHeight()
            );
            ctx.restore();
        });
    }
}