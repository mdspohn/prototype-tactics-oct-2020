class Markers {
    constructor() {
        // marker types to render
        this.path = new Array();
        this.range = new WeakMap();
        this.focus = null;
        this.selection = new WeakMap();

        this.markers = {
            white: {
                index: 0,
                opacity: 0,
                baseOpacity: 0.2,
                duration: 4000,
                ms: 0
            },
            yellow: {
                index: 1,
                opacity: 0,
                baseOpacity: 1,
                duration: 4000,
                ms: 0
            },
            red: {
                index: 2,
                opacity: 0,
                baseOpacity: 1,
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
        this.focus = location;
    }

    setPath(path) {
        this.path = path;
    }

    clearRange() {
        this.range = new WeakMap();
    }

    clearSelection() {
        this.selection = new WeakMap();
    }

    clearFocus() {
        this.focus = null;
    }

    clearPath() {
        this.path = new Array();
    }

    update(step) {
        Object.entries(this.markers).forEach(([type, config]) => {
            config.ms = (config.ms + step) % config.duration;
            if (config.hasOwnProperty('opacity'))
                config.opacity = Math.floor(Math.abs(config.ms - (config.duration / 2))) / (config.duration * 2);
        });
    }

    render(delta, location) {
        const selection = this.selection?.get(location),
              range = this.range?.get(location);

        if (selection === undefined && range === undefined && this.focus === null)
            return;

        const M_O = [Util.ORIENTATIONS.WEST, Util.ORIENTATIONS.EAST],
              S_O = [Util.ORIENTATIONS.WEST, Util.ORIENTATIONS.NORTH],
              isSlope = location.isSlope(),
              isMirrored = isSlope && M_O.includes(location.getOrientation());

        const index = ~~isSlope * (S_O.includes(location.getOrientation()) ? 1 : 2);

        Game.ctx.save();
        Game.ctx.translate(Game.camera.posX() + location.posX() + (~~isMirrored * 32), Game.camera.posY() + location.posY());

        let markerIndex;

        if (selection !== undefined && selection.isSelectable) {
            markerIndex = this.markers[selection.color].index;
            Game.ctx.globalAlpha = this.markers[selection.color].opacity + this.markers[selection.color].baseOpacity;
        } else if (range !== undefined && range.isSelectable) {
            markerIndex = this.markers[range.color].index;
            Game.ctx.globalAlpha = this.markers[range.color].opacity + this.markers[range.color].baseOpacity + (~~this.path.includes(location) * 0.4);
        }

        if (isMirrored) {
            Game.ctx.scale(-1, 1);
        }

        if (markerIndex !== undefined) {
            Game.ctx.drawImage(this.img, index * 32, markerIndex * 32, 32, 24, 0, 0, 32, 24);
            Game.ctx.globalAlpha = 1;
        }

        if (this.focus === location) {
            const overflow = Math.floor((this.markers.focus.ms % (this.markers.focus.duration * .75)) / (this.markers.focus.duration * .25));
            let focusIndex = overflow + (~~!overflow * Math.floor(this.markers.focus.ms / (this.markers.focus.duration * .5)));
            Game.ctx.drawImage(this.img, focusIndex * 32, (index * 32) + 96, 32, 24, 0, 0, 32, 24);
        }

        Game.ctx.restore();
    }
}