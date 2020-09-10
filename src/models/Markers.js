class Markers {
    constructor() {
        this.range = new WeakMap();
        this.path = new WeakMap();
        this.selection = new WeakMap();

        this.focus = new Object();
        this.focus.location = null;
        this.focus.ms = 0;
        this.focus.duration = 750;

        this.colors = new Object();
        this.colors.white = new Object();
        this.colors.white.index = 0;
        this.colors.white.opacity = 0.2;
        this.colors.white.ms = 0;
        this.colors.white.duration = 4000;

        this.colors.red = new Object();
        this.colors.red.index = 2;
        this.colors.red.opacity = 1;
        this.colors.red.ms = 0;
        this.colors.red.duration = 4000;
    }

    async _load() {
        const loader = (resolve) => {
            this.img = new Image();
            this.img.onload = resolve;
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}miscellaneous${OS_FILE_SEPARATOR}tile-markers.png`;
        };
        await new Promise(loader);
    }

    getImage() {
        return this.img;
    }

    // -------------------
    // Getters
    // -------------------------

    getRange() {
        return this.range;
    }

    getPath() {
        return this.path;
    }

    getSelection() {
        return this.selection;
    }

    getFocus() {
        return this.focus.location;
    }

    // -------------------
    // Setters
    // -------------------------

    setRange(range = new WeakMap()) {
        this.range = range;
    }

    setPath(path = new WeakMap()) {
        this.path = path;
    }

    setSelection(selection = new WeakMap()) {
        this.selection = selection;
    }

    setFocus(location = null) {
        this.focus.location = location;
    }
}