class Tileset {
    constructor(category, data) {
        this.category = category;
        this.src = data.src;
        this.measurements = data.measurements;
        this.configuration = data.configuration;
    }

    get width()  { return this.img.width;   }
    get height() { return this.img.height;  }
    get tw()     { return this.measurements.tile?.width;    }
    get th()     { return this.measurements.tile?.height;   }
    get td()     { return this.measurements.tile?.depth;    }
    get sw()     { return this.measurements.sprite.width;  }
    get sh()     { return this.measurements.sprite.height; }

    async load() {
        const pending = resolve => {
            this.img = new Image();
            this.img.onload = resolve;
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}${this.category}${OS_FILE_SEPARATOR}${this.src}`;
        };
        await new Promise(pending);
    }
}