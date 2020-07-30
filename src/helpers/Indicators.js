class CombatIndicators {
    constructor() {
        this.img = new Image();
        this.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}miscellaneous${OS_FILE_SEPARATOR}tile-markers.png`;
    }

    async _load() {
        const loader = (resolve) => {
            this.img.onload = resolve;
            this.img.src = this.src;
        };
        await new Promise(loader);
    }

    update(step) {

    }

    render(delta, loc) {

    }
}