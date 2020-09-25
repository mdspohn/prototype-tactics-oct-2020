class Location {
    constructor(x, y, tiles, tileset) {
        this.x = x;
        this.y = y;

        this.tw = tileset.tw;
        this.th = tileset.th;
        this.td = tileset.td;

        this.tiles = new Array();
        tiles = Array.isArray(tiles) ? tiles : [tiles];
        tiles.forEach(id => {
            const tile = new Tile(id, tileset.config[id]);
            this.tiles.push(tile);
        });
    }

    getTiles() {
        return this.tiles;
    }

    _getTopTile() {
        return this.tiles.slice(-1)[0];
    }

    getZ() {
        return this.tiles.length;
    }

    getOffsetX() {
        return ~~this._getTopTile().ox;
    }

    getOffsetY() {
        return ~~this._getTopTile().oy;
    }

    getPosX() {
        return this.y * (this.tw / 2) - this.x * (this.tw / 2) + this.getOffsetX();
    }

    getPosY() {
        return  this.y * (this.td / 2) + this.x * (this.td / 2) - (this.getZ() - 1) * this.th + this.getOffsetY();
    }
    
    isWater() {
        return this._getTopTile().water;
    }

    isSloped() {
        return this._getTopTile().slope;
    }

    getOrientation() {
        return this._getTopTile().orientation;
    }
}