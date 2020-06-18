class Tileset {
    constructor({ id, src, config, tiles } = config) {
        this.id     = id;
        this.src    = src;
        this.width  = config.width;
        this.height = config.height;
        this.depth  = config.depth;
        this.tiles  = tiles;
        this.img = null;
    }

    load() {
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.onload = () => resolve();
            this.img.src = 'assets/maps/' + this.src;
        });
    }

    render(id) {
        const tile = this.tiles[id];
        if (!tile)
            return;
            
        const idx = this.tiles[id].idx,
              col = Math.floor(((idx * this.width) % this.img.width) / this.width),
              row = Math.floor((idx * this.width) / this.img.width);
        
        Game.ctx.drawImage(this.img, (col * this.width), (row * (this.height + this.depth)), this.width, (this.height + this.depth), 0, 0, this.width, (this.height + this.depth));
    }

    
}