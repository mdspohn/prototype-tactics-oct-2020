class DecorationRenderer extends Renderer {
    constructor(settings) {
        super(settings);
    }

    _nextFrame(tile, decorations, peek = false) {
        let config = tile;
        if (peek) {
            config = new Object();
            config.animation = Object.create(tile.animation);
        }

        if (config.animation.next !== null) {
            config.id  = config.next;
            config.idx = decorations.getTileConfig(config.id).idx;
            config.water = Boolean(decorations.getTileConfig(config.id).water);
            config.slope = Boolean(decorations.getTileConfig(config.id).slope);
            config.orientation = decorations.getTileConfig(config.id).orientation;
            config.mirror = Boolean(decorations.getTileConfig(config.id).mirror);
            config.ox  = 0;
            config.oy  = 0;
        }

        const TILE_CONFIG = decorations.getTileConfig(config.id);

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

    update(step, decorations) {
        decorations.tiles.forEach(row => {
            row.forEach(col => {
                col.forEach(tile => {
                    if (tile.animation === null)
                        return;
                    tile.animation.ms += (step * this.speed);
                    while (tile.animation.ms > decorations.getTileConfig(tile.id).frames[tile.animation.frame].ms)
                        this._nextFrame(tile, decorations);
                });
            });
        });
    }

    render(delta, ctx, camera, location, decorations) {
        const tiles = decorations.tiles[location.getX()]?.[location.getY()];
        if (tiles === undefined)
            return;
        
        tiles.forEach((tile, z) => {
            while (tile.animation !== null && ((tile.animation.ms + (delta * this.speed)) > decorations.getTileConfig(tile.id).frames[tile.animation.frame].ms))
                tile = this._nextFrame(tile, decorations, true);

            if (tile.idx === -1)
                return;

            const IS_MIRRORED = decorations.getTileConfig(tile.id).mirror,
                  POS_X = (~~IS_MIRRORED * decorations.getTileWidth()) - (location.getPosX()) - ((decorations.getTileWidth() - location.getTileWidth()) / 2),
                  POS_Y = (location.getPosY()) - (decorations.getTileHeight() - location.getTileDepth() - location.getTileHeight()) - (decorations.getTileHeight() * z);
          
            ctx.save();
            ctx.translate(camera.posX() - (POS_X * this.scaling), camera.posY() + (POS_Y * this.scaling));

            if (IS_MIRRORED)
                ctx.scale(-1, 1);

            ctx.drawImage(
                decorations.getImage(),
                (tile.idx * decorations.getTileWidth()) % decorations.getImageWidth(),
                Math.floor((tile.idx * decorations.getTileWidth()) / decorations.getImageWidth()) * (decorations.getTileHeight()),
                decorations.getTileWidth(),
                decorations.getTileHeight(),
                this.scaling * tile.ox,
                this.scaling * tile.oy,
                this.scaling * decorations.getTileWidth(),
                this.scaling * decorations.getTileHeight()
            );
            ctx.restore();
        });
    }
}