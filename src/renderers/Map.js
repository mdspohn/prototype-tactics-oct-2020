class MapRenderer {
    static update(map, ms, isDeltaUpdate, { speed = 1, sorting = 'X' } = settings) {
        const adjustedMs = ms * speed;
        map.getLocations(sorting).forEach(location => {
            location.getTiles().forEach(tile => {
                if (tile.animation === null)
                    return;
                
                tile.animation.ms += ~~!isDeltaUpdate * adjustedMs;
                tile.animation.delta = ~~isDeltaUpdate * adjustedMs;
                
                while ((tile.animation.ms + tile.animation.delta) > map.getTileConfig(tile.id).frames[tile.animation.frame].ms)
                    MapRenderer.nextFrame(tile, map);
            });
        });
    }

    static render(map, location, { scaling = 1 } = settings) {
        location.getTiles().forEach((tile, z) => {
            if (tile.idx === -1)
                return;
            
            const isMirrored = map.getTileConfig(tile.id).mirrored,
                  translateX = ((location.x - location.y) * (map.tw / 2)) + (map.tw * ~~isMirrored) + tile.ox,
                  translateY = ((location.x + location.y) * (map.td / 2)) - (map.th * z) + tile.oy;
          
            Game.ctx.save();
            Game.ctx.translate(Game.camera.getPosX() - translateX * scaling, Game.camera.getPosY() + translateY * scaling);

            if (isMirrored)
                Game.ctx.scale(-1, 1);

            Game.ctx.drawImage(
                map.img,
                (tile.idx * location.tw) % map.width,
                Math.floor((tile.idx * map.tw) / map.width) * (map.th + map.td),
                map.tw,
                map.th + map.td,
                0,
                0,
                (map.tw * scaling),
                (map.th + map.td) * scaling
            );
            Game.ctx.restore();
        });
    }

    static nextFrame(tile, map) {
        if (tile.animation.next !== null)
            MapRenderer.nextAnimation(tile, map);

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
    }

    static nextAnimation(tile, map) {
        const config = map.getTileConfig(tile.animation.next);
        tile.id  = tile.animation.next;
        tile.idx = config.idx;
        tile.water  = Boolean(config.water);
        tile.slope  = Boolean(config.slope);
        tile.mirror = Boolean(config.mirror);
        tile.orientation = config.orientation;
        tile.ox = 0;
        tile.oy = 0;
    }
}