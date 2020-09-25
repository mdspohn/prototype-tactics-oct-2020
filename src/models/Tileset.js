class Tileset {
    constructor(category, data) {
        this.category = category;
        this.data = data;
    }

    get config() { return this.data.config; }
    get width()  { return this.img.width;   }
    get height() { return this.img.height;  }
    get tw()     { return this.data.measurements.sprite.width;  }
    get th()     { return this.data.measurements.sprite.height; }
    get td()     { return this.data.measurements.sprite.depth;  }

    async load() {
        const pending = resolve => {
            this.img = new Image();
            this.img.onload = resolve;
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}${this.category}${OS_FILE_SEPARATOR}${this.data.src}`;
        };
        await new Promise(pending);
    }
}