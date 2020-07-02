class Location {
    constructor({ x, y, z, posX, posY, occupant }) {
        // tile position
        this.x = x;
        this.y = y;
        this.z = z;
        this.posX = posX;
        this.posY = posY;

        // tile state
        this.solid = true;
        this.liquid = false;
        this.occupant = occupant;
    }
}

class Layout {
    constructor(map, entities) {
        this.tw = map.tiles.tileset.tw;
        this.th = map.tiles.tileset.th;
        this.td = map.tiles.tileset.td;
        
        this.boundaries = { x1: 0, x2: 0, y1: 0, y2: 0 };
        this.structure = map.tiles.layout.map((row, ri) => {
            return row.map((column, ci) => {
                const tiles = map.tiles.layout[ri][ci] = Array.isArray(column) ? column : Array.of(column);
                const loc = new Location({
                    x: ri,
                    y: ci,
                    z: tiles.length,
                    posX: (ci * (this.tw / 2)) - (ri * (this.tw / 2)),
                    posY: (ci * (this.td / 2)) + (ri * (this.td / 2)) - ((tiles.length - 1) * this.th),
                    occupant: entities.find(target => target.x == ri && target.y == ci)
                });

                this.boundaries.x1 = Math.min(loc.posX, this.boundaries.x1);
                this.boundaries.x2 = Math.max(loc.posX, this.boundaries.x2);
                this.boundaries.y2 = Math.max(loc.posY, this.boundaries.y2);

                return loc;
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