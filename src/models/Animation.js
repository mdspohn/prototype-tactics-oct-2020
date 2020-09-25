// "config": {
//     "idle": {
//         "east": {
//             "frames": [
//                 { "idx": 2, "ms": 125 },
//                 { "idx": 1, "ms": 250 },
//                 { "idx": 2, "ms": 125 }
//             ],
//             "variation": [
//                 { "idx": 3, "ms": 125 },
//                 { "idx": 4, "ms": 250 },
//                 { "idx": 3, "ms": 125 }
//             ]
//         },

class Animation {
    constructor(id, config) {
        this.id = id;
        this.config = config;
    }
}

class BeastAnimation extends Animation {
    constructor(id, config) {
        super(id, config);

        // ----------------------
        // Animation State
        // ----------------------------

        this.destination = null;
        this.orientation = 'east';
        this.variation = false;
        this.ms = 0;
        this.idx = 0;
        this.movement = false;

        this.ix = this.iy = this.iz = 0;
        this.tx = this.ty = this.tz = 0;
        this.cx = this.cy = this.cz = 0;

        this.x = 0;
        this.y = 0;

        this.events = {
            start: null,
            end: null
        };


        animation.id = 'idle';
        animation.variation = !previous?.variation;
        animation.mirrored = Boolean(config.mirrored);
        animation.config = (animation.variation && config.variation !== undefined) ? config.variation : config.frames;
        animation.ms = previous?.ms || 0;
        animation.multipliers = new Array(animation.config.length).fill(1);
        animation.frame = 0;
        animation.destination = unit.location;
        animation.orientation = unit.orientation;
        animation.movement = false;
        animation.events = new Object();
        animation.x = animation.ox = ~~config.ox;
        animation.y = animation.oy = ~~config.oy;
    }

    getConfig() {
        return this.config[this.orientation] ? this.config[this.orientation] : this.config;
    }

    getFrames() {
        return this.getConfig().frames;
    }

    getFrame() {
        return this.getFrames()[this.frame];
    }

    isMirrored() {
        return Boolean(this.getConfig().mirrored);
    }
}