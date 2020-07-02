class Tileset {
    constructor({ dir, src, config, tiles }) {
        // tileset image source
        this.dir = dir;
        this.src = src;

        // individual tile default dimensions
        this.tw = config.width;
        this.th = config.height;
        this.td = config.depth;

        // config by tile id
        this.tiles = tiles;
    }

    _load() {
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.onload = () => resolve();
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}${this.dir}${OS_FILE_SEPARATOR}${this.src}`;
        });
    }
}