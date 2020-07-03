class Decoration {
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
        const id = this.tiles[loc.x][loc.y];
        if (this.tileset.tiles[id] == undefined)
            return;

        Game.ctx.save();
        Game.ctx.translate(Game.camera.position.x + loc.posX, Game.camera.position.y + loc.posY - this.tileset.th);
        Game.ctx.drawImage(
            this.tileset.img,
            this.tileset.tiles[id].idx * this.tileset.tw,
            0,
            this.tileset.tw,
            this.tileset.th,
            0,
            0,
            this.tileset.tw,
            this.tileset.th
        );
        Game.ctx.restore();
    }
}