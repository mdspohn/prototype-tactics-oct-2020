class Tile {
    constructor(id, type, configuration, ...{ speed = 1, delay = 0 }) {
        this.id = id;
        this.type = type;
        this.name = configuration.name;

        this.ox = ~~configuration.ox;
        this.oy = ~~configuration.oy;

        this.frames = configuration.frames || null;
        this.idx = ~~configuration.idx;
        this.ms = 0 - delay;
        this.delta = 0;
        this.speed = speed;

        // this.reactions = configuration.reactions;
    }

    get index() { return (this.frames !== null) ? this.frames[this.idx].idx : this.idx; }
}

class WalkableTile extends Tile {
    constructor(id, type, configuration, settings = {}) {
        super(id, type, configuration, settings);

        this.unreachable = Boolean(configuration.unreachable);
        this.hazard = Boolean(configuration.hazard);
        this.water = Boolean(configuration.water);
        this.slope = Boolean(configuration.slope);
        this.orientation = configuration.orientation;

        this.footing = ~~configuration.footing; // modifier for physical accuracy/evasion
        this.aspect  = ~~configuration.aspect; // modifier for magical accuracy/evasion
    }
}

class Location {
    constructor(x, y, configuration, tileset) {
        this.x = x;
        this.y = y;

        this.tileWidth = tileset.tw;
        this.tileHeight = tileset.th;
        this.tileDepth = tileset.td;
        this.spriteWidth = tileset.sw;
        this.spriteHeight = tileset.sh;

        this.tiles = GeneralLogic.toArray(configuration.tiles[x]?.[y]);
        this.tiles = this.tiles.map(id => new WalkableTile(id, 'tiles', tileset.configuration.tiles[id]));
        
        this.decorations = GeneralLogic.toArray(configuration.decorations[x]?.[y]);
        this.decorations = this.decorations.map(id => new Tile(id, 'decorations', tileset.configuration.decorations[id]));
    }

    get sw() { return this.spriteHeight; }
    get sh() { return this.spriteWidth;  }
    get tw() { return this.tileWidth;    }
    get th() { return this.tileHeight;   }
    get td() { return this.tileDepth;    }

    get tile() { return this.tiles[this.tiles.length - 1]; }
    get z()    { return this.tiles.length;                 }
    get ox()   { return this.tile.ox;                      }
    get oy()   { return this.tile.oy;                      }

    get posX() { return (this.y * (this.tw / 2)) - (this.x * (this.tw / 2)) + this.ox; }
    get posY() { return (this.y * (this.td / 2)) + (this.x * (this.td / 2)) + this.oy - ((this.z - 1) * this.th) + (this.sh - this.th - this.td); }

    get isWater()     { return this.tile.water;       }
    get isSloped()    { return this.tile.slope;       }
    get orientation() { return this.tile.orientation; }
}

class Map {
    constructor(configuration, tileset) {
        this.tileset = tileset;
        this.configuration = configuration;

        this.layout = new Array();
        this.boundaries = new Object();
        this.boundaries.x1 = 0;
        this.boundaries.x2 = 0;
        this.boundaries.y1 = 0;
        this.boundaries.y2 = 0;

        for (let x = 0; x < this.configuration.tiles.length; x++) {
            this.layout.push(new Array());
            for (let y = 0; y < this.configuration.tiles[x].length; y++) {
                const point = new Location(x, y, this.configuration, this.tileset);
                this.boundaries.x1 = Math.min(this.boundaries.x1, point.posX                  );
                this.boundaries.x2 = Math.max(this.boundaries.x2, point.posX                  );
                this.boundaries.y2 = Math.max(this.boundaries.y2, point.posY - this.tileset.td);
                this.layout[x].push(point);
            }
        }

        this.sorted = new Object();
        this.sorted.X = [].concat(...this.layout).sort((a, b) => (a.x - b.x) ? a.x - b.x : a.y - b.y);
        this.sorted.Y = [].concat(...this.layout).sort((a, b) => (a.y - b.y) ? a.y - b.y : a.x - b.x);
    }

    get img()       { return this.tileset.img;        }
    get imgWidth()  { return this.tileset.img.width;  }
    get imgHeight() { return this.tileset.img.height; }
    get sw()        { return this.tileset.sw;         }
    get sh()        { return this.tileset.sh;         }
    get tw()        { return this.tileset.tw;         }
    get th()        { return this.tileset.th;         }
    get td()        { return this.tileset.td;         }

    getLocation(x, y) {
        return this.layout[x]?.[y];
    }

    getSorted(order = 'X') {
        return this.sorted[order];
    }

    find(fn, order = 'X') {
        return this.getSorted(order).find(location => fn(location));
    }

    filter(fn, order = 'X') {
        return this.getSorted(order).filter(location => fn(location));
    }

    forEach(fn, order = 'X') {
        this.getSorted(order).forEach(location => fn(location));
    }
}