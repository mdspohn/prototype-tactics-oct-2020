class MapRenderer {
    static update(map, ms, { speed = 1, sort = 'X' } = settings) {
        ms *= speed;
        map.getSorted(sort).forEach(location => {
            [...location.tiles, ...location.decorations].forEach(tile => {
                if (tile.frames === null)
                    return;
                
                tile.ms += ms;
                
                while (tile.ms > tile.frames[tile.idx].ms)
                    MapRenderer.nextFrame(tile, map);
            });

            // fading for obstructions
            if (location.obstructs === null)
                return;
                
            if (location.fade && location.opacity !== 50) {
                location.ms += ms;
                location.opacity = 100 - Math.min((location.ms / location.duration) * 50, 50);
                if (location.opacity === 50)
                    location.ms = 0;
            } else if (!location.fade && location.opacity !== 100) {
                location.ms += ms;
                location.opacity = 50 + Math.min((location.ms / location.duration) * 50, 50);
                if (location.opacity === 100)
                    location.ms = 0;
            }
        });
    }

    static renderTiles(map, location, { scaling = 1 } = settings) {
        location.tiles.forEach((tile, z) => {
            if (tile.index === -1)
                return;
            
            const translateX = ((location.x - location.y) * (map.tw / 2)) + tile.ox,
                  translateY = ((location.x + location.y) * (map.td / 2)) - (map.th * z) + tile.oy;
          
            Game.ctx.save();
            Game.ctx.translate(Game.camera.getPosX() - (translateX * scaling), Game.camera.getPosY() + (translateY * scaling));

            Game.ctx.drawImage(
                map.img,
                (tile.index * map.sw) % map.imgWidth,
                Math.floor((tile.index * map.sw) / map.imgWidth) * map.sh,
                map.tw,
                (map.th + map.td),
                0,
                0,
                map.tw * scaling,
                (map.th + map.td) * scaling
            );
            Game.ctx.restore();
        });
    }

    static renderDecorations(map, location, { scaling = 1 } = settings) {
        location.decorations.forEach((tile, z) => {
            if (tile.index === -1)
                return;

            const translateX = location.posX - (map.sw - map.tw) + tile.ox,
                  translateY = location.posY - (map.sh - map.th - map.td) - (map.sh * z) + tile.oy;
          
            Game.ctx.save();
            Game.ctx.translate(Game.camera.getPosX() + (translateX * scaling), Game.camera.getPosY() + (translateY * scaling));

            Game.ctx.filter = `opacity(${location.opacity}%)`;

            Game.ctx.drawImage(
                map.img,
                (tile.index * map.sw) % map.imgWidth,
                Math.floor((tile.index * map.sw) / map.imgWidth) * map.sh,
                map.sw,
                map.sh,
                0,
                0,
                map.sw * scaling,
                map.sh * scaling
            );
            Game.ctx.restore();
        });
    }

    static nextFrame(tile, map) {
        tile.ms -= tile.frames[tile.idx].ms;

        if (tile.frames[tile.idx].next !== undefined)
            return MapRenderer.nextAnimation(tile, map);

        tile.idx = (tile.idx + 1) % tile.frames.length;
    }

    static nextAnimation(tile, map) {
        tile.id = tile.frames[tile.idx].next;

        const config = map.tileset.configuration[tile.type][tile.id];

        tile.name = config.name;
        tile.idx = ~~config.idx;
        tile.ox = ~~config.ox;
        tile.oy = ~~config.oy;

        if (!(tile instanceof WalkableTile))
            return;
        
        tile.unreachable = Boolean(config.unreachable);
        tile.hazard = Boolean(config.hazard);
        tile.water = Boolean(config.water);
        tile.slope = Boolean(config.slope);
        tile.orientation = config.orientation || null;

        tile.footing = ~~config.footing;
        tile.aspect  = ~~config.aspect;
    }
}