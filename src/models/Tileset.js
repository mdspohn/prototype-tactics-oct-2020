class Tileset {
    constructor(category, data) {
        this.img = new Image();
        this.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}${category}${OS_FILE_SEPARATOR}${data.src}`;

        // individual tile default dimensions
        this.tw = ~~data.measurements.sprite.width;
        this.th = ~~data.measurements.sprite.height;
        this.td = ~~data.measurements.sprite.depth;

        // frame and animation configurations
        this.config = data.config;
    }

    async _load() {
        const loader = (resolve) => {
            this.img.onload = resolve;
            this.img.src = this.src;
        };
        await new Promise(loader);
    }
}