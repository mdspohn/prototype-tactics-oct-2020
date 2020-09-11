class MapRenderer extends Renderer {
    constructor(settings) {
        super(settings);
    }

    _nextFrame(tile, map, peek = false) {
        let config = tile;
        if (peek) {
            config = new Object();
            config.animation = Object.create(tile.animation);
        }

        if (config.animation.next !== null) {
            config.id  = config.next;
            config.idx = map.getTileConfig(config.id).idx;
            config.water = Boolean(map.getTileConfig(config.id).water);
            config.slope = Boolean(map.getTileConfig(config.id).slope);
            config.orientation = map.getTileConfig(config.id).orientation;
            config.ox  = 0;
            config.oy  = 0;
        }

        const TILE_CONFIG = map.getTileConfig(config.id);

        if (TILE_CONFIG.frames !== undefined) {
            config.animation.ms -= TILE_CONFIG.frames[config.animation.frame].ms;
            config.animation.frame = (config.animation.frame + 1) % TILE_CONFIG.frames.length;

            const NEW_FRAME = TILE_CONFIG.frames[config.animation.frame];
            config.animation.next = NEW_FRAME.next !== undefined ? NEW_FRAME.next : null;
            config.idx  = NEW_FRAME.idx;
            config.ox   = ~~NEW_FRAME.ox;
            config.oy   = ~~NEW_FRAME.oy;
        } else {
            config.animation = null;
        }

        config.ox += ~~TILE_CONFIG.ox;
        config.oy += ~~TILE_CONFIG.oy;

        return config;
    }

    update(step, map) {
        map.forEach(location => {
            location.getTiles().forEach(tile => {
                if (tile.animation !== null) {
                    tile.animation.ms += (step * this.speed);
                    while (tile.animation.ms > map.getTileConfig(tile.id).frames[tile.animation.frame].ms)
                        this._nextFrame(tile, map);
                }
            });
        });
    }

    render(delta, ctx, camera, location, map) {
        location.getTiles().forEach((tile, z) => {
            while (tile.animation !== null && ((tile.animation.ms + (delta * this.speed)) > map.getTileConfig(tile.id).frames[tile.animation.frame].ms))
                tile = this._nextFrame(tile, map, true);

            if (tile.idx === -1)
                return;

            const IS_MIRRORED = map.getTileConfig(tile.id).mirror,
                  POS_X = camera.posX() - (this.scaling * (((location.getX() - location.getY()) * (map.getTileWidth() / 2)) + (map.getTileWidth()  * ~~IS_MIRRORED))),
                  POS_Y = camera.posY() + (this.scaling * (((location.getX() + location.getY()) * (map.getTileDepth() / 2)) - (map.getTileHeight() * z)));
          
            ctx.save();
            ctx.translate(POS_X, POS_Y);

            if (IS_MIRRORED)
                ctx.scale(-1, 1);

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