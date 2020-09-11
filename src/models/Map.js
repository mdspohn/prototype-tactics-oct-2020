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
                this.boundaries.y2 = Math.max(this.boundaries.y2, locale.getPosY() - this.getTileDepth());
                return locale;
            });
        });

        this.sorted = new Object();
        this.sorted['X'] = [].concat(...this.structure).sort((a, b) => (a.x - b.x) ? a.x - b.x : a.y - b.y);
        this.sorted['Y'] = [].concat(...this.structure).sort((a, b) => (a.y - b.y) ? a.y - b.y : a.x - b.x);
        this.method = 'X';

        this.event = Events.listen('sort', (method) => this.method = method, true);
    }

    _destroy(events) {
        events.remove('sort', this.event);
    }

    // --------------------
    // Layout Searching
    // -----------------------

    getLocation(x, y) {
        return this.structure[x]?.[y];
    }

    forEach(fn) {
        this.sorted[this.method].forEach(location => fn(location));
    }

    filter(fn) {
        return this.sorted[this.method].filter(location => fn(location));
    }

    find(fn) {
        return this.sorted[this.method].find(location => fn(location));
    }

    // --------------------
    // Tileset Image
    // -----------------------

    getImage() {
        return this.tileset.img;
    }

    getImageWidth() {
        return this.tileset.img.width;
    }

    getImageHeight() {
        return this.tileset.img.height;
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

    getTileWidth() {
        return this.tileset.tw;
    }

    getTileHeight() {
        return this.tileset.th;
    }

    getTileDepth() {
        return this.tileset.td;
    }
}