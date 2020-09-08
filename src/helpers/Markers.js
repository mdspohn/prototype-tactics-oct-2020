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
        //this.markers.focus.ms = 0;
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

    clearAll() {
        this.clearRange();
        this.clearFocus();
        this.clearSelection();
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
        const drawSelection = this.selection?.get(location),
              drawRange = this.range?.get(location);
        if (this.focus === null && !drawSelection && !drawRange)
            return;

        const isSlope = location.isSlope(),
              isMirrored = isSlope && [Util.ORIENTATIONS.EAST, Util.ORIENTATIONS.WEST].includes(location.getOrientation()),
              x = ~~isSlope * ([Util.ORIENTATIONS.NORTH, Util.ORIENTATIONS.WEST].includes(location.getOrientation()) ? 1 : 2);

        Game.ctx.save();
        Game.ctx.translate(Game.camera.posX() + location.posX() + (~~isMirrored * 32), Game.camera.posY() + location.posY());

        if (isMirrored)
            Game.ctx.scale(-1, 1);

        if (drawSelection) {
            const config = this.selection.get(location),
                  y = this.markers[config.color].index;
            
            Game.ctx.globalAlpha = this.markers[config.color].opacity + this.markers[config.color].baseOpacity;
            Game.ctx.drawImage(this.img, x * 32, y * 32, 32, 24, 0, 0, 32, 24);
            Game.ctx.globalAlpha = 1;
        } else if (drawRange) {
            if (this.range?.get(location).isSelectable) {
                const config = this.range.get(location),
                    y = this.markers[config.color].index;
                
                Game.ctx.globalAlpha = this.markers[config.color].opacity + this.markers[config.color].baseOpacity + (~~this.path.includes(location) * 0.4);
                Game.ctx.drawImage(this.img, x * 32, y * 32, 32, 24, 0, 0, 32, 24);
                Game.ctx.globalAlpha = 1;
            }
        }

        if (this.focus === location) {
            const overflow = Math.floor((this.markers.focus.ms % (this.markers.focus.duration * .75)) / (this.markers.focus.duration * .25));
            let focusIndex = overflow + (~~!overflow * Math.floor(this.markers.focus.ms / (this.markers.focus.duration * .5)));
            //let focusIndex = Math.floor(this.markers.focus.ms / (this.markers.focus.duration / 2));
            Game.ctx.drawImage(this.img, focusIndex * 32, (x * 32) + 96, 32, 24, 0, 0, 32, 24);
        }

        Game.ctx.restore();
    }
}