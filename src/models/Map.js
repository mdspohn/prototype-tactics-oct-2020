class TileAnimation {
    constructor(settings) {
        this.speed = 1;
        this.delay = 200;
        this.steps = [];
        this.frame = 0
    }

    get index() {
        return this.steps[this.frame].index;
    }
}

class Map {
    constructor(config, tileset) {
        this.tileset = tileset;

        this.boundaries = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
        };

        this.structure = config.tiles.map((row, ri) => {
            return row.map((tiles, ci) => {
                const locale = new Location(ri, ci, tiles, tileset);
                this.boundaries.x1 = Math.min(this.boundaries.x1, locale.getPosX());
                this.boundaries.x2 = Math.max(this.boundaries.x2, locale.getPosX());
                this.boundaries.y1 = 0;
                this.boundaries.y2 = Math.max(this.boundaries.y2, locale.getPosY() - this.td);
                return locale;
            });
        });

        this.sorted = new Object();
        this.sorted['X'] = [].concat(...this.structure).sort((a, b) => (a.x - b.x) ? a.x - b.x : a.y - b.y);
        this.sorted['Y'] = [].concat(...this.structure).sort((a, b) => (a.y - b.y) ? a.y - b.y : a.x - b.x);
    }

    get tw()     { return this.tileset.tw;     }
    get th()     { return this.tileset.th;     }
    get td()     { return this.tileset.td;     }
    get img()    { return this.tileset.img;    }
    get width()  { return this.tileset.width;  }
    get height() { return this.tileset.height; }

    // --------------------
    // Layout Searching
    // -----------------------

    getLocation(x, y) {
        return this.structure[x]?.[y];
    }

    getLocations(order = 'X') {
        return this.sorted[order];
    }

    forEach(fn, order = 'X') {
        this.sorted[order].forEach(location => fn(location));
    }

    filter(fn, order = 'X') {
        return this.sorted[order].filter(location => fn(location));
    }

    find(fn, order = 'X') {
        return this.sorted[order].find(location => fn(location));
    }

    // --------------------
    // Tileset Animations / Dimensions
    // -----------------------

    getTilesetConfig() {
        return this.tileset.config;
    }

    getTileConfig(id) {
        return this.tileset.config[id];
    }
}