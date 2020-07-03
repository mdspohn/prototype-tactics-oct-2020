class Map {
    constructor(config) {
        this.tiles = config.tiles;
        this.tileset;
        this.tileset_id = config.tileset;
    }

    async _prepare(assets) {
        this.tileset = assets[this.tileset_id];
        if (this.tileset == undefined) {
            this.tileset = new Tileset(Data.getTileset(this.tileset_id));
            await this.tileset._load();
            assets[this.tileset_id] = this.tileset;
        }
    }

    update(step) {
        // update animations
    }

    render(delta, loc) {
        this.tiles[loc.x][loc.y].forEach((id, index) => {
            if (this.tileset.tiles[id] == undefined)
                return;
            
            Game.ctx.save();
            Game.ctx.translate(
                Game.camera.position.x - ((loc.x - loc.y) * (this.tileset.tw / 2)),
                Game.camera.position.y + ((loc.x + loc.y) * (this.tileset.td / 2)) - (index * this.tileset.th)
            );
            Game.ctx.drawImage(
                this.tileset.img,
                this.tileset.tiles[id].idx * this.tileset.tw % this.tileset.img.width,
                Math.floor((this.tileset.tiles[id].idx * this.tileset.tw / this.tileset.img.width)) * (this.tileset.th + this.tileset.td),
                this.tileset.tw,
                this.tileset.th + this.tileset.td,
                0,
                0,
                this.tileset.tw,
                this.tileset.th + this.tileset.td
            );
            Game.ctx.restore();
        });
    }
}