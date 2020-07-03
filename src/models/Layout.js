class Layout {
    constructor(map, entities) {
        this.boundaries = new Object();
        this.boundaries.x1 = 0;
        this.boundaries.x2 = 0;
        this.boundaries.y1 = 0;
        this.boundaries.y2 = 0;

        this.tw = map.tileset.tw;
        this.th = map.tileset.th;
        this.td = map.tileset.td;

        this.structure = map.tiles.map((row, rowIdx) => {
            return row.map((col, colIdx) => {
                const tiles = map.tiles[rowIdx][colIdx] = Array.isArray(col) ? col : Array.of(col);

                const location = new Object();
                location.x = rowIdx;
                location.y = colIdx;
                location.z = tiles.length;
                location.tw = this.tw;
                location.th = this.th;
                location.td = this.td;
                location.posX = colIdx * (location.tw / 2) - rowIdx * (location.tw / 2);
                location.posY = colIdx * (location.td / 2) + rowIdx * (location.td / 2) - (tiles.length - 1) * location.th;
                location.occupant = entities.find(target => target.x == rowIdx && target.y == colIdx);
                location.slope = map.tileset.tiles[tiles[tiles.length - 1]].slope;

                this.boundaries.x1 = Math.min(this.boundaries.x1, location.posX);
                this.boundaries.x2 = Math.max(this.boundaries.x2, location.posX);
                this.boundaries.y1 = 0;
                this.boundaries.y2 = Math.max(this.boundaries.y2, location.posY - location.td);

                return location;
            });
        });
        
        this.order = new Array(2);
        this.order[0] = [].concat(...this.structure).sort((a, b) => (a.x - b.x) ? a.x - b.x : a.y - b.y);
        this.order[1] = [].concat(...this.structure).sort((a, b) => (a.y - b.y) ? a.y - b.y : a.x - b.x);
        
        this.sortingMethod = 0;

        // listen to events that will affect layout in some way
        // this.eventId = Events.listen('move', (data) => this._onMove(data));
    }

    async _destroy() {
        // Events.remove('move', this.eventId);
    }

    _onMove(data) {
        // do stuff to structure when entity is moved
    }

    forEach(fn) {
        this.order[this.sortingMethod].forEach(location => fn(location));
    }
}