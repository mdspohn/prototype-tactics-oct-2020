class CombatMarkers {
    constructor() {
        this.type = 'movement';
        this.markers = {
            movement: {
                index: 1,
                opacity: 0,
                duration: 4000,
                ms: 0
            }
        }

        this.patterns = new Object();
        this.patterns['POINT'] = function(location, layout, opts) {
            return [location];
        };
        this.patterns['CROSS_EXCLUSIVE'] = function(location, layout, opts) {
            const selection = [],
                  x = location.x,
                  y = location.y,
                  s1 = layout.getLocation(x + 1, y),
                  s2 = layout.getLocation(x - 1, y),
                  s3 = layout.getLocation(x, y + 1),
                  s4 = layout.getLocation(x, y - 1);
            
            [s1, s2, s3, s4].forEach(tile => {
                if (tile !== undefined && this.abidesByRestrictions(location, tile, opts))
                    selection.push(tile);
            });
            return selection;
        };
        this.patterns['CROSS_INCLUSIVE'] = function(location, layout, opts) {
            const selection = this.patterns['CROSS_EXCLUSIVE'](location, layout, opts);
            selection.push(location);
            return selection;
        };

        // marker types to render
        this.range = null;
        this.focus = null;
        this.selection = null;
    }

    async _load() {
        const loader = (resolve) => {
            this.img = new Image();
            this.img.onload = resolve;
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}miscellaneous${OS_FILE_SEPARATOR}tile-markers.png`;
        };
        await new Promise(loader);
    }

    abidesByRestrictions(fromLocation, toLocation, restrictions) {
        let valid = true;

        if (!restrictions)
            return valid;
        
        // check height difference
        if (restrictions.height !== undefined) {
            valid &= Math.abs(fromLocation.z() - toLocation.z()) <= restrictions.height;
        }

        // check for water target
        if (restrictions.water === true) {
            valid &= !toLocation.isWater();
        }

        return valid;
    }

    getPathing(fromLocation, toLocation, range) {

    }

    getRange(fromLocation, distance, restrictions, layout, entities) {
        const range = new Object();
        const addTile = (x, y, px, py, steps = 0) => {
            if (layout.getLocation(x, y) === undefined)
                return;
            
            if (!entities.some(entity => entity != this && entity.x() == x && entity.y() == y)) {
                range[x] = range[x] || new Object();
    
                if (range[x][y] != undefined && range[x][y].steps <= steps)
                    return;
        
                range[x][y] = {
                    px,
                    py,
                    steps,
                    showMarker: x != fromLocation.x || y != fromLocation.y
                };
        
                if (steps >= distance)
                    return;
                
                addTile(Math.max(x - 1, 0), y, x, y, (steps + 1));
                addTile(x, Math.min(y + 1, layout.structure[x].length - 1), x, y, (steps + 1));
                addTile(Math.min(x + 1, layout.structure.length - 1), y, x, y, (steps + 1));
                addTile(x, Math.max(y - 1, 0), x, y, (steps + 1));
            }
        };
        
        addTile(fromLocation.x, fromLocation.y, void 0, void 0);
        return range;
    }

    isInRange(target, range) {
       return range[target.x]?.[target.y] !== undefined;
    }

    setRange(range) {
        this.range = range;
    }

    setFocus(location) {
        this.focus = location;
    }

    setSelection(location, layout, pattern = 'CROSS_EXCLUSIVE', opts) {
        if (location === null)
            this.selection = null;

        if (this.patterns.hasOwnProperty(pattern)) {
            this.selection = this.patterns[pattern](location, layout, opts);
        } else {
            console.warning(`Attack pattern type "${pattern}" not implemented.`);
        }
    }

    clearRange() {
        this.range = null;
    }

    clearFocus() {
        this.focus = null;
    }

    clearSelection() {
        this.selection = null;
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
        if (this.type === null)
            return;

        this.markers[this.type].ms = (this.markers[this.type].ms + (step)) % this.markers[this.type].duration;
        this.markers[this.type].opacity = Math.floor(Math.abs(this.markers[this.type].ms - (this.markers[this.type].duration / 2))) / (this.markers[this.type].duration * 2);
    }

    render(delta, location) {
        const showMarker = this.range?.[location.x]?.[location.y]?.showMarker,
              index = ~~location.isSlope() * (['north', 'west'].includes(location.orientation()) ? 1 : 2),
              IS_MIRRORED = location.isSlope() && ['east', 'west'].includes(location.orientation());
        
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