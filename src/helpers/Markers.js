class Markers {
    constructor() {
        // marker types to render
        this.range = null;
        this.focus = null;
        this.selection = null;

        this.type = 'movement';
        this.markers = {
            movement: {
                index: 0,
                opacity: 0,
                duration: 4000,
                ms: 0
            },
            skill: {
                index: 1,
                opacity: 0,
                duration: 4000,
                ms: 0
            },
            selection: {
                index: 2,
                opacity: 0,
                duration: 4000,
                ms: 0
            },
            focus: {
                duration: 750,
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

    setRange(range) {
        this.range = range;
    }

    setSelection(range) {
        this.selection = range;
    }

    setFocus(location) {
        //this.markers.focus.ms = 0;
        this.focus = location;
    }

    clearRange() {
        this.range = null;
    }

    clearSelection() {
        this.selection = null;
    }

    clearFocus() {
        this.focus = null;
    }

    clearAll() {
        this.setRange(null);
        this.setFocus(null);
        this.setSelection(null);
    }

    set(range, type = 'movement') {
        this.range = range;
        this.type = type;
        this.markers[type].ms = this.markers[type].duration / 2;
        this.markers[type].opacity = Math.floor(Math.abs(this.markers[type].ms - (this.markers[type].duration / 2))) / (this.markers[type].duration * 2);
    }

    clear() {
        this.type = null;
        this.range = null;
    }

    update(step) {
        Object.entries(this.markers).forEach(([type, config]) => {
            config.ms = (config.ms + step) % config.duration;
            if (config.hasOwnProperty('opacity'))
                config.opacity = Math.floor(Math.abs(config.ms - (config.duration / 2))) / (config.duration * 2);
        });
    }

    render(delta, location) {
        // TODO: needs to use delta
        const needsDraw = this.range?.get(location)?.isSelectable;
        if (this.focus === null && !needsDraw)
            return;

        const isSlope = location.isSlope(),
              isMirrored = isSlope && [Util.ORIENTATIONS.EAST, Util.ORIENTATIONS.WEST].includes(location.getOrientation()),
              xIndex = ~~isSlope * ([Util.ORIENTATIONS.NORTH, Util.ORIENTATIONS.WEST].includes(location.getOrientation()) ? 1 : 2);

        Game.ctx.save();
        Game.ctx.translate(Game.camera.posX() + location.posX() + (~~isMirrored * 32), Game.camera.posY() + location.posY());

        if (isMirrored)
            Game.ctx.scale(-1, 1);

        if (needsDraw) {
            const yIndex = this.markers[this.range.get(location).markerType].index;
            Game.ctx.globalAlpha = this.markers[this.type].opacity + 0.1;
            Game.ctx.drawImage(this.img, xIndex * 32, yIndex * 32, 32, 24, 0, 0, 32, 24);
            Game.ctx.globalAlpha = 1;
        }

        if (this.focus === location) {
            const overflow = Math.floor((this.markers.focus.ms % (this.markers.focus.duration * .75)) / (this.markers.focus.duration * .25));
            let focusIndex = overflow + (~~!overflow * Math.floor(this.markers.focus.ms / (this.markers.focus.duration * .5)));
            //let focusIndex = Math.floor(this.markers.focus.ms / (this.markers.focus.duration / 2));
            Game.ctx.drawImage(this.img, focusIndex * 32, 96, 32, 24, 0, 0, 32, 24);
        }

        Game.ctx.restore();
    }
}