class Tileset {
    constructor(category, data) {
        this.img = new Image();
        this.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}${category}${OS_FILE_SEPARATOR}${data.src}`;
        
        this.config = data.config;

        this.tw = ~~data.measurements.sprite.width;
        this.th = ~~data.measurements.sprite.height;
        this.td = ~~data.measurements.sprite.depth;
    }

    async _load() {
        const loader = (resolve) => {
            this.img.onload = resolve;
            this.img.src = this.src;
        };
        await new Promise(loader);
        this.width = this.img.width;
        this.height = this.img.height;
    }
}