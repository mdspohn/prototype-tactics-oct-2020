class Location {
    constructor(x, y, map) {
        // reference to parent map
        this.map = map;
        this.tw = map.tw;
        this.th = map.th;
        this.td = map.td;

        // tile coordinates
        this.x = x;
        this.y = y;
    }

    z() {
        // total tiles stacked on this position
        return this.map.tiles[this.x][this.y].length;
    }

    tile() {
        return this.map.tiles[this.x][this.y][this.z() - 1];
    }

    ox() {
        // x offset of the tile, accounting for animation
        return this.tile().ox;
    }

    oy() {
        // y offset of the tile, accounting for animation
        return this.tile().oy;
    }

    posX() {
        // canvas x coordinate of the top left corner of the tile
        return this.y * (this.tw / 2) - this.x * (this.tw / 2) + this.ox();
    }

    posY() {
        // canvas y coordinate of the top left corner of the tile
        return this.y * (this.td / 2) + this.x * (this.td / 2) - (this.z() - 1) * this.th + this.oy();
    }
    
    isWater() {
        return !!this.map.meta[this.tile().id].water;
    }

    isSlope() {
        return !!this.map.meta[this.tile().id].slope;
    }

    orientation() {
        // cardinal orientation of the tile, if it exists, e.g. slopes
        return this.map.meta[this.tile().id].orientation;
    }
}