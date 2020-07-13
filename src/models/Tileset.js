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

    update(step, animation) {
        // no animation if this gets set
        let animationId = animation.id,
            idx = this.config[animationId].idx;

        if (idx !== undefined)
            return;

        // animation calculations
        animation.ms += step;
        const allFrames = this.config[animationId].frames,
              currentFrame = animation.frame,
              currentFrameMs = allFrames[currentFrame].ms;
        
        // check if we should update to next frame
        if (animation.ms > currentFrameMs) {
            animation.ms -= currentFrameMs;
            animation.frame = (currentFrame + 1) % allFrames.length;

            // is the last frame requesting a swap to another animation?
            if (allFrames[currentFrame].next !== undefined) {
                animation.id = allFrames[currentFrame].next;
                animation.frame = 0;
            }
        }
    }

    render(delta, animation) {
        // no animation if this gets set
        let id = animation.id,
            nextId = id,
            idx = this.config[id].idx,
            frame = animation.frame;

        if (idx === undefined) {
            // animation calculations
            const allFrames = this.config[id].frames,
                  currentFrame = frame,
                  currentFrameMs = allFrames[currentFrame].ms;
            
            // check if we should be rendering the next frame
            if ((animation.ms + delta) > currentFrameMs) {
                frame = (currentFrame + 1) % allFrames.length;

                // is the last frame requesting a swap to another animation?
                if (allFrames[currentFrame].next !== undefined) {
                    nextId = allFrames[currentFrame].next;
                    frame = 0;
                }
            }

            // did we swap to something that isn't animated?
            if (this.config[nextId].idx !== undefined) {
                idx = this.config[nextId].idx;
            } else {
                animation.ox = ~~this.config[nextId].frames[frame].ox;
                animation.oy = ~~this.config[nextId].frames[frame].oy;
                idx = this.config[nextId].frames[frame].idx;
            }
        }

        if (idx === -1)
            return;
        
        Game.ctx.drawImage(
            this.img,
            idx * this.tw % this.img.width,
            Math.floor((idx * this.tw) / this.img.width) * (this.th + this.td),
            this.tw,
            this.th + this.td,
            animation.ox,
            animation.oy,
            this.tw,
            this.th + this.td
        );
    }
}