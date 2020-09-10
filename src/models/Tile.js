class Tile {
    constructor(config) {
        this.id = config.id;
        this.idx = config.idx;

        this.water = Boolean(config.water);
        this.slope = Boolean(config.slope);
        this.orientation = config.orientation;

        this.ox = ~~config.ox;
        this.oy = ~~config.oy;

        if (config.frames !== undefined) {
            this.animation = new Object();
            this.animation.ms = 0;
            this.animation.frame = 0;
            this.animation.next = config.frames[0].next !== undefined ? config.frames[0].next : null;
            this.idx = config.frames[0].idx;
            this.ox += ~~config.frames[0].ox;
            this.oy += ~~config.frames[0].oy;
        } else {
            this.animation = null;
        }
    }
}