class CombatIndicators {
    constructor() {
        this.range = null;
        this.type = 'movement';
        this.markers = {
            movement: {
                index: 1,
                opacity: 0,
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

    set(range, type = 'movement') {
        this.range = range;
        this.type = type;
        this.markers[type].ms = this.markers[type].duration / 2;
        this.markers[type].opacity = Math.floor(Math.abs(this.markers[type].ms - (this.markers[type].duration / 2))) / (this.markers[type].duration * 2);
    }

    clear() {
        this.range = null;
    }

    update(step) {
        if (this.type === null)
            return;

        this.markers[this.type].ms = (this.markers[this.type].ms + (step)) % this.markers[this.type].duration;
        this.markers[this.type].opacity = Math.floor(Math.abs(this.markers[this.type].ms - (this.markers[this.type].duration / 2))) / (this.markers[this.type].duration * 2);

    }

    render(delta, location) {
        const showMarker = this.range?.[location.x]?.[location.y]?.showMarker,
              index = ~~location.slope() * (['north', 'west'].includes(location.orientation()) ? 1 : 2),
              IS_MIRRORED = location.slope() && ['east', 'west'].includes(location.orientation());
        
        if (!showMarker || !this.type)
            return;

        Game.ctx.save();
        Game.ctx.translate(Game.camera.posX() + location.posX() + (~~IS_MIRRORED * 32), Game.camera.posY() + location.posY());

        if (IS_MIRRORED)
            Game.ctx.scale(-1, 1);

        Game.ctx.globalAlpha = this.markers[this.type].opacity + 0.1;
        Game.ctx.drawImage(this.img, index * 32, 0, 32, 24, 0, 0, 32, 24);
        Game.ctx.restore();
    }
}