class Decoration {
    constructor(config) {
        // tileset config
        this.tileset_id = config.tileset;
        this.tile_config = Data.getTileset(this.tileset_id, 'decorations');
        this.tileset_src = `${ASSET_DIR}${OS_FILE_SEPARATOR}${this.tile_config.directory}${OS_FILE_SEPARATOR}${this.tile_config.src}`;
        this.tileset = new Image();

        // tile dimensions
        this.tw = ~~this.tile_config.measurements.sprite.width;
        this.th = ~~this.tile_config.measurements.sprite.height;

        // tile animation data
        this.meta = this.tile_config.config;

        // map layout
        this.tiles = config.tiles.map(row => {
            return row.map(col => {
                return (Array.isArray(col) ? col : Array.of(col)).map(id => {
                    const tile = new Object();
                    tile.id = id;
                    tile.ox = ~~this.meta[tile.id].ox;
                    tile.oy = ~~this.meta[tile.id].oy;

                    if (this.meta[tile.id].idx)
                        return tile;
                    
                    tile.frame = 0;
                    tile.ms = ~~this.meta[tile.id].delay;
                    return tile;
                });
            });
        });
    }
    
    async _prepare() {
        const loader = (resolve) => {
            this.tileset.onload = resolve;
            this.tileset.src = this.tileset_src;
        };
        await new Promise(loader);
    }

    update(step, location) {
        if (!this.tiles[location.x] || !this.tiles[location.x][location.y])
            return;
        this.tiles[location.x][location.y].forEach(tile => {
            // not animated, nothing to do
            if (this.meta[tile.id].idx !== undefined)
                return;

            tile.ms += step;

            // no frame change
            const ms = this.meta[tile.id].frames[tile.frame].ms;
            if (ms >= tile.ms)
                return;

            const next = this.meta[tile.id].frames[tile.frame].next;

            tile.ms -= ms;
            tile.frame = (tile.frame + 1) % this.meta[tile.id].frames.length;

            // animation requested tile change
            if (next === undefined)
                return;
            
            tile.id = next;
            tile.frame = 0;
        });
    }

    render(delta, location) {
        if (!this.tiles[location.x] || !this.tiles[location.x][location.y])
            return;

        const x = Game.camera.position.x + location.posX() - ((this.tw - location.tw) / 2),
              y = Game.camera.position.y + location.posY() - (this.th - location.td - location.th);
        
        this.tiles[location.x][location.y].forEach((tile, index) => {
            let idx = this.meta[tile.id].idx;

            if (idx === undefined) {
                let next = tile.id,
                    frame = tile.frame;
                
                // check if we should be rendering the next frame
                if ((tile.ms + delta) > this.meta[tile.id].frames[tile.frame].ms) {
                    frame = (tile.frame + 1) % this.meta[tile.id].frames.length;

                    if (this.meta[tile.id].frames[tile.frame].next !== undefined) {
                        next = this.meta[tile.id].frames[tile.frame].next;
                        frame = 0;
                    }
                }

                // get the correct image index based off next tile id to be rendered
                if (this.meta[next].idx !== undefined) {
                    idx = this.meta[next].idx;
                    tile.ox = ~~this.meta[next].ox;
                    tile.oy = ~~this.meta[next].oy;
                } else {
                    idx = this.meta[next].frames[frame].idx;
                    tile.ox = ~~this.meta[next].ox + ~~this.meta[next].frames[frame].ox;
                    tile.oy = ~~this.meta[next].oy + ~~this.meta[next].frames[frame].oy;
                }
            }

            // move on if tile requested is empty
            if (idx === -1) 
                return;
            
            Game.ctx.save();
            Game.ctx.translate(x + (~~this.meta[tile.id].mirror * this.tw), y - (index * this.th));
            if (this.meta[tile.id].mirror)
                Game.ctx.scale(-1, 1);
            Game.ctx.drawImage(
                this.tileset,
                idx * this.tw % this.tileset.width,
                Math.floor((idx * this.tw) / this.tileset.width) * (this.th),
                this.tw,
                this.th,
                tile.ox,
                tile.oy,
                this.tw,
                this.th
            );
            Game.ctx.restore();
        });
    }

    add(x, y, ...ids) {
        ids.forEach(id => {
            const tile = new Object();
            tile.id = id;
            tile.ox = ~~this.meta[tile.id].ox;
            tile.oy = ~~this.meta[tile.id].oy;

            if (this.meta[tile.id].idx == undefined) {
                tile.frame = 0;
                tile.ms = ~~this.meta[tile.id].delay;
            }
            
            this.tiles[x][y].push(tile);
        });
    }

    remove(x, y) {
        this.tiles[x][y] = [{ id: 0, ox: 0, oy: 0 }];
    }

    replace(x, y, ...ids) {
        const newTiles = new Array();
        ids.forEach(id => {
            const tile = new Object();
            tile.id = id;
            tile.ox = ~~this.meta[tile.id].ox;
            tile.oy = ~~this.meta[tile.id].oy;

            if (this.meta[tile.id].idx == undefined) {
                tile.frame = 0;
                tile.ms = ~~this.meta[tile.id].delay;
            }
            
            newTiles.push(tile);
        });
        this.tiles[x][y] = newTiles;
    }
}