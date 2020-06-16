class Tileset {
    constructor({ id, src, config, tiles } = config) {
        this.id     = id;
        this.src    = src;
        this.width  = config.width;
        this.height = config.height;
        this.depth  = config.depth;
        this.tiles  = tiles;

        this.tiles.forEach(tile => {
            if (tile.animated == true) {
                Object.values(tile.animations).forEach(animation => {
                    let animationTime = 0;
                    animation.frames.forEach(frame => animationTime += frame.ms);
                    animation.totalMs = animationTime;
                });
            }
        });

        this.img = null;
    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.onload = () => {
                resolve();
            };
            this.img.src = 'assets/stages/' + this.src;
        });
    }

    render(context, tile_id, animation_id, time) {
        let idx;
        if (this.tiles[tile_id].animated == true) {
            let counted = 0,
                currentMs = time % this.tiles[tile_id].animations[animation_id].totalMs;
            idx = this.tiles[tile_id].animations[animation_id].frames.find(frame => {
                counted += frame.ms;
                if (counted >= currentMs)
                    return true;
            })['idx'];
        } else {
            idx = this.tiles[tile_id].idx;
        }
        const col = (idx * this.width) % this.img.width,
              row = Math.floor((idx * this.width) / this.img.width);
        
        context.drawImage(this.img, (col * this.width), (row * (this.height + this.depth)), this.width, (this.height + this.depth), 0, 0, this.width, (this.height + this.depth));
    }

    
}