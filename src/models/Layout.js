class Layout {
    constructor(map, entities) {
        this.boundaries = new Object();
        this.boundaries.x1 = 0;
        this.boundaries.x2 = 0;
        this.boundaries.y1 = 0;
        this.boundaries.y2 = 0;

        this.tw = map.tw;
        this.th = map.th;
        this.td = map.td;

        this.structure = map.tiles.map((row, ri) => {
            return row.map((tiles, ci) => {
                const location = new Object();
                location.tw = this.tw;
                location.th = this.th;
                location.td = this.td;
                location.x = ri;
                location.y = ci;
                location.z =  () => map.tiles[ri][ci].length;
                location.ox = () => map.tiles[ri][ci][location.z() - 1].ox;
                location.oy = () => map.tiles[ri][ci][location.z() - 1].oy;
                location.posX = () => location.y * (location.tw / 2) - location.x * (location.tw / 2) + location.ox();
                location.posY = () => location.y * (location.td / 2) + location.x * (location.td / 2) - (location.z() - 1) * location.th + location.oy();
                location.getOccupants = () => entities.filter(entity => entity.location == location);
                location.slope = () => Boolean(map.meta[map.tiles[ri][ci][location.z() - 1].id].slope);

                this.boundaries.x1 = Math.min(this.boundaries.x1, location.posX());
                this.boundaries.x2 = Math.max(this.boundaries.x2, location.posX());
                this.boundaries.y1 = 0;
                this.boundaries.y2 = Math.max(this.boundaries.y2, location.posY() - location.td);

                return location;
            });
        });
        
        this.sorted = new Object();
        this.sorted.X = [].concat(...this.structure).sort((a, b) => (a.x - b.x) ? a.x - b.x : a.y - b.y);
        this.sorted.Y = [].concat(...this.structure).sort((a, b) => (a.y - b.y) ? a.y - b.y : a.x - b.x);

        this.method = 'X';
        this.listenerId = Events.listen('sort', (method) => this.method = method, true);
    }

    _destroy() {
        Events.remove('sort', this.listenerId);
    }

    getLocation(x, y) {
        return this.structure[x]?.[y];
    }

    forEach(fn) {
        this.sorted[this.method].forEach(location => fn(location));
    }

    find(fn) {
        return this.sorted[this.method].find(location => fn(location));
    }
}