class Map {
    constructor(config, tileset) {
        this.tileset = tileset;
        this.structure = config.tiles.map((row, ri) => {
            return row.map((tiles, ci) => {
                return new Location(ri, ci, tiles, tileset.config);
            });
        });
        this.sorted = new Object();
        this.sorted['X'] = [].concat(...this.structure).sort((a, b) => (a.x - b.x) ? a.x - b.x : a.y - b.y);
        this.sorted['Y'] = [].concat(...this.structure).sort((a, b) => (a.y - b.y) ? a.y - b.y : a.x - b.x);
        this.sortMethod = 'X';

        this.event = Events.listen('sort', (method) => this.sortMethod = method, true);
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
        this.sorted[this.sortMethod].forEach(location => fn(location));
    }

    filter(fn) {
        return this.sorted[this.sortMethod].filter(location => fn(location));
    }

    find(fn) {
        return this.sorted[this.sortMethod].find(location => fn(location));
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
        return this.tileset.tw;
    }

    getTileDepth() {
        return this.tileset.tw;
    }
}