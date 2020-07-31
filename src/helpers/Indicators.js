class CombatIndicators {
    constructor() {
        this.range = null;
        this.type = 'movement';
        this.markers = {
            movement: {
                index: 1,
                opacity: 0.75,
                max_opacity: 0.75,
                min_opacity: 0.25,
                duration: 4000,
                ms: 0
            }
        }
    }

    async _load() {
        const loader = (resolve) => {
            this.img = new Image();
            this.img.onload = resolve;
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}miscellaneous${OS_FILE_SEPARATOR}tile-markers.png`;
        };
        await new Promise(loader);
    }

    display(type, range) {
        this.markers[type].opacity = (this.markers[type].min_opacity + this.markers[type].max_opacity) / 2;
        this.type = type;
        this.range = range;
    }

    update(step) {
        if (this.type === null)
            return;

        this.markers[this.type].ms = (this.markers[this.type].ms + (step)) % this.markers[this.type].duration;
        this.markers[this.type].opacity = Math.floor(Math.abs(this.markers[this.type].ms - (this.markers[this.type].duration / 2))) / (this.markers[this.type].duration * 2);

    }

    render(delta, location) {
        const showMarker = this.range?.[location.x]?.[location.y]?.showMarker;
        if (!showMarker || !this.type)
            return;

        Game.ctx.save();
        Game.ctx.translate(Game.camera.position.x + location.posX(), Game.camera.position.y + location.posY());
        Game.ctx.globalAlpha = this.markers[this.type].opacity + 0.1;
        Game.ctx.drawImage(this.img, 1 * 32, 0, 32, 16, 0, 0, 32, 16);
        Game.ctx.restore();
    }
}