class Map {
    constructor(config, tileset) {
        this.tileset = tileset.img;

        // tile dimensions
        this.tw = tileset.tw;
        this.td = tileset.td;
        this.th = tileset.th;

        // tile animation data
        this.meta = tileset.config;

        // map layout
        this.tiles = config.tiles.map(row => {
            return row.map(col => {
                return (Array.isArray(col) ? col : Array.of(col)).map(id => {
                    const tile = new Object();
                    tile.id = id;
                    tile.frame = 0;
                    tile.ox = ~~this.meta[tile.id].ox;
                    tile.oy = ~~this.meta[tile.id].oy;
                    tile.ms = ~~this.meta[tile.id].delay;
                    
                    return tile;
                });
            });
        });
    }

    _handleFrameComplete(tile) {
        tile.ms -= this.meta[tile.id].frames[tile.frame].ms;

        if (this.meta[tile.id].frames[tile.frame].next !== undefined) {
            tile.id = this.meta[tile.id].frames[tile.frame].next;
            tile.frame = 0;
            tile.ms *= ~~(this.meta[tile.id].idx === undefined);
        } else {
            tile.frame = (tile.frame + 1) % this.meta[tile.id].frames.length;
        }

        tile.ox = ~~this.meta[tile.id].ox + ~~this.meta[tile.id].frames?.[tile.frame].ox;
        tile.oy = ~~this.meta[tile.id].oy + ~~this.meta[tile.id].frames?.[tile.frame].oy;
    }

    update(step, location) {
        this.tiles[location.x][location.y].forEach(tile => {
            if (this.meta[tile.id].idx !== undefined)
                return;
            
            tile.ms += step;
            while (this.meta[tile.id].frames !== undefined && tile.ms > this.meta[tile.id].frames[tile.frame].ms)
                this._handleFrameComplete(tile);
        });
    }

    render(delta, location) {
        const x = Game.camera.posX() - ((location.x - location.y) * (this.tw / 2)),
              y = Game.camera.posY() + ((location.x + location.y) * (this.td / 2));
        
        this.tiles[location.x][location.y].forEach((tile, z) => {
            if (this.meta[tile.id].frames !== undefined) {
                while (this.meta[tile.id].frames !== undefined && (tile.ms + delta) > this.meta[tile.id].frames[tile.frame].ms)
                    this._handleFrameComplete(tile);
            }
            
            const index = (this.meta[tile.id].frames !== undefined) ? this.meta[tile.id].frames[tile.frame].idx : this.meta[tile.id].idx;

            // move on if tile requested is empty
            if (index === -1) 
                return;
            
            Game.ctx.save();
            Game.ctx.translate(x + (~~this.meta[tile.id].mirror * this.tw), y - (z * this.th));
            if (this.meta[tile.id].mirror)
                Game.ctx.scale(-1, 1);
            Game.ctx.drawImage(
                this.tileset,
                index * this.tw % this.tileset.width,
                Math.floor((index * this.tw) / this.tileset.width) * (this.th + this.td),
                this.tw,
                this.th + this.td,
                tile.ox,
                tile.oy,
                this.tw,
                this.th + this.td
            );
            Game.ctx.restore();
        });
    }

    add(x, y, ...ids) {
        ids.forEach(id => {
            const tile = new Object();
            tile.id = id;
            tile.frame = 0;
            tile.ox = ~~this.meta[id].ox + ~~this.meta[id].frames?.[0].ox;
            tile.oy = ~~this.meta[id].oy + ~~this.meta[id].frames?.[0].oy;
            tile.ms = ~~this.meta[tile.id].delay;
            
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
            tile.frame = 0;
            tile.ox = ~~this.meta[id].ox + ~~this.meta[id].frames?.[0].ox;
            tile.oy = ~~this.meta[id].oy + ~~this.meta[id].frames?.[0].oy;
            tile.ms = ~~this.meta[tile.id].delay;
            
            newTiles.push(tile);
        });
        this.tiles[x][y] = newTiles;
    }
    
    replaceTop(x, y, ...ids) {
        const newTiles = new Array();
        ids.forEach(id => {
            const tile = new Object();
            tile.id = id;
            tile.frame = 0;
            tile.ox = ~~this.meta[id].ox + ~~this.meta[id].frames?.[0].ox;
            tile.oy = ~~this.meta[id].oy + ~~this.meta[id].frames?.[0].oy;
            tile.ms = ~~this.meta[id].delay;
            
            newTiles.push(tile);
        });
        this.tiles[x][y].pop();
        this.tiles[x][y].push(...newTiles);
    }
}