class Tileset {
    constructor({ directory, src, measurements, config }) {
        // tileset image source
        this.directory = directory;
        this.src = src;

        // individual tile default dimensions
        this.tw = ~~measurements.sprite.width;
        this.th = ~~measurements.sprite.height;
        this.td = ~~measurements.sprite.depth;

        this.ty = this.th + this.td

        // frame and animation configurations
        this.config = config;
    }

    _load() {
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.onload = () => resolve();
            this.img.onerror = () => reject();
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}${this.directory}${OS_FILE_SEPARATOR}${this.src}`;
        });
    }

    render(delta, tile) {
        let frame = (tile.finalFrame == undefined) ? this.config[tile.id].frame : tile.finalFrame;

        if (frame == undefined) {
            // animation calculations
            tile.ms += delta;
            const animationFrames = this.config[tile.id].animation,
                  frameMs = animationFrames[tile.frame].ms;
            if (tile.ms > frameMs) {
                tile.ms -= frameMs;
                tile.frame = (tile.frame + 1) % animationFrames.length;
                if (animationFrames[tile.frame].stop) {
                    tile.finalFrame = animationFrames[tile.frame].frame;
                }
            }
            tile.oy = ~~animationFrames[tile.frame].oy;
            tile.ox = ~~animationFrames[tile.frame].ox;
            frame = animationFrames[tile.frame].frame;
        }

        if (frame === -1)
            return;
        
        Game.ctx.drawImage(
            this.img,
            frame * this.tw % this.img.width,
            Math.floor((frame * this.tw) / this.img.width) * (this.th + this.td),
            this.tw,
            this.th + this.td,
            tile.ox,
            tile.oy,
            this.tw,
            this.th + this.td
        );
    }
}