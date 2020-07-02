class Map {
    constructor(config) {
        this.tiles = new Object();
        this.tiles.tileset = new Tileset(Data.getTileset(config.map.tileset));
        this.tiles.layout = config.map.layout;
        
        this.decoration = new Object();
        this.decoration.tileset = new Tileset(Data.getTileset(config.decoration.tileset));
        this.decoration.layout = config.decoration.layout;
    }

    async _prepare() {
        return Promise.all([this.tiles.tileset._load(), this.decoration.tileset._load()]);
    }
}

Map.prototype.update = function(step) {
};

Map.prototype.renderTile = function(delta, location) {
    const t = this.tiles.tileset,
          x = Game.camera.position.x - ((location.x - location.y) * (t.tw / 2)),
          y = Game.camera.position.y + ((location.x + location.y) * (t.td / 2));

    this.tiles.layout[location.x][location.y].forEach((id, index) => {
        if (t.tiles[id] == undefined)
            return;
        
        Game.ctx.save();
        Game.ctx.translate(x, y - (index * t.th));

        const sx = Math.floor(((t.tiles[id].idx * t.tw) % t.img.width) / t.tw) * t.tw,
              sy = Math.floor((t.tiles[id].idx * t.tw) / t.img.width) * (t.th + t.td);
        
        Game.ctx.drawImage(
            t.img,
            sx,
            sy,
            t.tw,
            t.th + t.td,
            0,
            0,
            t.tw,
            t.th + t.td
        );
        Game.ctx.restore();
    });
};

Map.prototype.renderDecoration = function(delta, location) {
    const d = this.decoration.tileset,
          t = this.tiles.tileset,
          x = Game.camera.position.x - ((location.x - location.y) * (t.tw / 2)),
          y = Game.camera.position.y + ((location.x + location.y) * (t.td / 2));

    const id = this.decoration.layout[location.x][location.y]
    if (d.tiles[id] == undefined)
        return;

    Game.ctx.save();
    Game.ctx.translate(x, y - (location.z * t.th) - (d.th - (t.td + t.th)));
    Game.ctx.drawImage(d.img, (d.tiles[id].idx * d.tw), 0, d.tw, d.th, 0, 0, d.tw, d.th);
    Game.ctx.restore();
};