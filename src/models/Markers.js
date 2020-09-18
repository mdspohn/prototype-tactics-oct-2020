class Markers {
    constructor() {
        this.range = new WeakMap();
        this.path = new Array();
        this.selection = new WeakMap();
        this.directionalArrows = null;

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

    getDirectionalArrows() {
        return this.directionalArrows;
    }

    // -------------------
    // Setters
    // -------------------------

    setRange(range) {
        this.range = range === null ? new WeakMap() : range;
    }

    setPath(path) {
        this.path = path === null ? new Array() : path;
    }

    setSelection(selection) {
        this.selection = selection === null ? new WeakMap() : selection;
    }

    setFocus(location = null) {
        this.focus.location = location;
    }

    setDirectionalArrows(orientation = null) {
        this.directionalArrows = orientation;
    }
}