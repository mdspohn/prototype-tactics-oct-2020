class Location {
    constructor(x, y, map) {
        // reference to parent map
        this.map = map;
        this.tw = map.tw;
        this.th = map.th;
        this.td = map.td;

        // tile coords
        this.x = x;
        this.y = y;
    }

    z() {
        return this.map.tiles[this.x][this.y].length;
    }

    tile() {
        return this.map.tiles[this.x][this.y][this.z() - 1];
    }

    ox() {
        return this.tile().ox;
    }

    oy() {
        return this.tile().oy;
    }

    posX() {
        return this.y * (this.tw / 2) - this.x * (this.tw / 2) + this.ox();
    }

    posY() {
        return this.y * (this.td / 2) + this.x * (this.td / 2) - (this.z() - 1) * this.th + this.oy();
    }
    
    isWater() {
        return !!this.map.meta[this.tile().id].water;
    }

    isSlope() {
        return !!this.map.meta[this.tile().id].slope;
    }

    orientation() {
        return this.map.meta[this.tile().id].orientation;
    }
}

class Layout {
    constructor(map) {
        this.tw = map.tw;
        this.th = map.th;
        this.td = map.td;
        this.boundaries = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
        };

        this.structure = map.tiles.map((row, ri) => {
            return row.map((col, ci) => {
                const tile = new Location(ri, ci, map);

                this.boundaries.x1 = Math.min(this.boundaries.x1, tile.posX());
                this.boundaries.x2 = Math.max(this.boundaries.x2, tile.posX());
                this.boundaries.y1 = 0;
                this.boundaries.y2 = Math.max(this.boundaries.y2, tile.posY() - map.td);

                return tile;
            });
        });
        
        this.sorted = {
            X: [].concat(...this.structure).sort((a, b) => (a.x - b.x) ? a.x - b.x : a.y - b.y),
            Y: [].concat(...this.structure).sort((a, b) => (a.y - b.y) ? a.y - b.y : a.x - b.x)
        };
        this.method = 'X';
        this.event = Events.listen('sort', (method) => this.method = method, true);
    }

    _destroy() {
        Events.remove('sort', this.event);
    }

    getLocation(x, y) {
        return this.structure[x]?.[y];
    }

    filter(fn) {
        return this.sorted[this.method].filter(location => fn(location));
    }

    forEach(fn) {
        this.sorted[this.method].forEach(location => fn(location));
    }

    find(fn) {
        return this.sorted[this.method].find(location => fn(location));
    }
}