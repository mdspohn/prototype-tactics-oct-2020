class Decoration {
    constructor(config, tileset) {
        this.tileset = tileset;

        // tile animation data
        this.meta = tileset.config;

        // map layout
        this.tiles = config.tiles.map(row => {
            return row.map(col => {
                return (Array.isArray(col) ? col : Array.of(col)).map(id => {
                    return new Tile(id, this.tileset.config[id]);
                });
            });
        });
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