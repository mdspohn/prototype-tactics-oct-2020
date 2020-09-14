class MapRenderer extends Renderer {
    constructor(settings) {
        super(settings);
    }

    nextAnimation(tile, map) {
        const config = map.getTileConfig(tile.animation.next);
        tile.id = tile.animation.next;
        tile.idx = config.idx;
        tile.water = Boolean(config.water);
        tile.slope = Boolean(config.slope);
        tile.mirror = Boolean(config.mirror);
        tile.orientation = config.orientation;
        tile.ox = 0;
        tile.oy = 0;
    }

    nextFrame(tile, map) {
        if (tile.animation.next !== null)
            this.nextAnimation(tile, map);

        const config = map.getTileConfig(tile.id);

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

    update(step, map) {
        map.forEach(location => {
            location.getTiles().forEach(tile => {
                if (tile.animation !== null) {
                    tile.animation.ms += (step * this.speed);
                    while (tile.animation.ms > map.getTileConfig(tile.id).frames[tile.animation.frame].ms)
                        this.nextFrame(tile, map);
                }
            });
        });
    }

    render(delta, ctx, camera, location, map) {
        location.getTiles().forEach((tile, z) => {
            while (tile.animation !== null && ((tile.animation.ms + (delta * this.speed)) > map.getTileConfig(tile.id).frames[tile.animation.frame].ms))
                tile = this.nextFrame(tile.clone(), map);

            if (tile.idx === -1)
                return;

            const IS_MIRRORED = map.getTileConfig(tile.id).mirrored,
                  POS_X = camera.getPosX() - (this.scaling * (((location.getX() - location.getY()) * (map.getTileWidth() / 2)) + (map.getTileWidth()  * ~~IS_MIRRORED))),
                  POS_Y = camera.getPosY() + (this.scaling * (((location.getX() + location.getY()) * (map.getTileDepth() / 2)) - (map.getTileHeight() * z)));
          
            ctx.save();
            ctx.translate(POS_X, POS_Y);
            ctx.drawImage(
                map.getImage(),
                (tile.idx * map.getTileWidth()) % map.getImageWidth(),
                Math.floor((tile.idx * map.getTileWidth()) / map.getImageWidth()) * (map.getTileHeight() + map.getTileDepth()),
                map.getTileWidth(),
                map.getTileHeight() + map.getTileDepth(),
                this.scaling * tile.ox,
                this.scaling * tile.oy,
                this.scaling * map.getTileWidth(),
                this.scaling * (map.getTileHeight() + map.getTileDepth())
            );
            ctx.restore();
        });
    }
}