class DecorationRenderer {
    static update(decorations, ms, isDeltaUpdate, { speed = 1 } = settings) {
        const adjustedMs = ms * speed;
        decorations.tiles.forEach(row => {
            row.forEach(col => {
                col.forEach(tile => {
                    if (tile.animation === null)
                        return;
                
                    tile.animation.ms += ~~!isDeltaUpdate * adjustedMs;
                    tile.animation.delta = ~~isDeltaUpdate * adjustedMs;
                    
                    while ((tile.animation.ms + tile.animation.delta) > decorations.getTileConfig(tile.id).frames[tile.animation.frame].ms)
                        DecorationRenderer.nextFrame(tile, decorations);
                });
            });
        });
    }

    static render(decorations, location, { scaling = 1 } = settings) {
        const tiles = decorations.tiles[location.x]?.[location.y];
        if (tiles === undefined)
            return;
        
        tiles.forEach((tile, z) => {
            if (tile.idx === -1)
                return;
            
            const translateX = decorations.tw * ~~decorations.getTileConfig(tile.id).mirrored - (location.getPosX()) - ((decorations.tw - location.tw) / 2) + tile.ox,
                  translateY = location.getPosY() - (decorations.th - location.td - location.th) - (decorations.th * z) + tile.oy;
          
            Game.ctx.save();
            Game.ctx.translate(Game.camera.getPosX() - translateX * scaling, Game.camera.getPosY() + translateY * scaling);
            Game.ctx.drawImage(
                decorations.img,
                (tile.idx * decorations.tw) % decorations.width,
                Math.floor((tile.idx * decorations.tw) / decorations.width) * (decorations.th),
                decorations.tw,
                decorations.th,
                0,
                0,
                decorations.tw * scaling,
                decorations.th * scaling
            );
            Game.ctx.restore();
        });
    }

    static nextAnimation(tile, decorations) {
        const config = decorations.getTileConfig(tile.animation.next);
        tile.id = tile.animation.next;
        tile.idx = config.idx;
        tile.mirror = Boolean(config.mirror);
        tile.ox = 0;
        tile.oy = 0;
    }

    static nextFrame(tile, decorations) {
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
    }
}