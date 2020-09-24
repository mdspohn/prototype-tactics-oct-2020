class Decoration {
    constructor(config, tileset) {
        this.tileset = tileset;

        // map layout
        this.tiles = config.tiles.map(row => {
            return row.map(col => {
                return (Array.isArray(col) ? col : Array.of(col)).map(id => {
                    return new Tile(id, this.tileset.config[id]);
                });
            });
        });
    }

    get tw()     { return this.tileset.tw;         }
    get th()     { return this.tileset.th;         }
    get td()     { return this.tileset.td;         }
    get img()    { return this.tileset.img;        }
    get width()  { return this.tileset.img.width;  }
    get height() { return this.tileset.img.height; }

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