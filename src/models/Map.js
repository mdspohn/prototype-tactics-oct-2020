class Map {
    constructor(config) {
        this.id = config.id;
        this.layout = config.layout;
        this.tileset = Data.getTileset(config.tileset);
    }

    async load() {
        await this.tileset.load();

        const w = this.tileset.width,
              h = this.tileset.height,
              d = this.tileset.depth;
        
        this.layout = this.layout.map((r, ri) => {
            return r.map((c, ci) => {
                const location = new Object();
                location.x = ri;
                location.y = ci;
                location.z = c.length;
                location.posX = (ci * (w / 2)) - (ri * (w / 2));
                location.posY = (ci * (d / 2)) + (ri * (d / 2)) - (((c.length || 1) - 1) * h);
                location.tileset = c.length ? c : [c];
                location.sortIndex = ri + ci;
                return location;
            });
        });

        this.layout.sort((a, b) => a.sortIndex - b.sortIndex);
    }
}

Map.prototype.update = function(step) {
};

Map.prototype.render = function(delta, location) {
    const w = this.tileset.width,
          h = this.tileset.height,
          d = this.tileset.depth,
          x = Game.camera.position.x - ((location.x - location.y + 1) * (w / 2)),
          y = Game.camera.position.y + ((location.x + location.y) * (d / 2));

    location.tileset.forEach((id, index) => {
        Game.ctx.save();
        Game.ctx.translate(x, y - (index * h));
        this.tileset.render(id);
        Game.ctx.restore();
    });
};