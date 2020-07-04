class Decoration {
    constructor(config) {
        this.tileset;
        this.tileset_id = config.tileset;
        this.tiles = config.tiles.map(row => {
            return row.map(tiles => {
                if (Array.isArray(tiles))
                    return tiles.map(id => Object.create({ id, frame: 0, ms: 0 }));
                return [Object.create({ id: tiles, frame: 0, ms: 0 })];
            })
        });
    }

    async _prepare(assets) {
        this.tileset = assets[this.tileset_id];
        if (this.tileset == undefined) {
            this.tileset = new Tileset(Data.getTileset(this.tileset_id, 'decorations'));
            await this.tileset._load();
            assets[this.tileset_id] = this.tileset;
        }
    }

    update(step) {
        // update animations
    }

    render(delta, loc) {
        if (!this.tiles[loc.x] || !this.tiles[loc.x][loc.y])
            return;
        const x = Game.camera.position.x + loc.posX - ((this.tileset.tw - loc.tw) / 2),
              y = Game.camera.position.y + loc.posY - (this.tileset.th - loc.td - loc.th);
        
        this.tiles[loc.x][loc.y].forEach((tile, index) => {
            Game.ctx.save();
            Game.ctx.translate(x, y - (index * this.tileset.th));
            this.tileset.render(delta, tile);
            Game.ctx.restore();
        });
    }
}