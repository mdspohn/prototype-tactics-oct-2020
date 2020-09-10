class Location {
    constructor(x, y, tiles, config) {
        this.x = x;
        this.y = y;

        this.tiles = new Array();
        tiles.forEach(data => {
            const tile = new Tile(data, config[data.id]);
            this.tiles.push(tile);
        });
    }

    getTiles() {
        return this.tiles;
    }

    _getTopTile() {
        return this.tiles.slice(-1)[0];
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
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
        return this.getY() * (this.getTileWidth() / 2) - this.getX() * (this.getTileWidth() / 2) + this.getOffsetX();
    }

    getPosY() {
        return this.getY() * (this.getTileDepth() / 2) + this.getX() * (this.getTileDepth() / 2) - (this.getZ() - 1) * this.getTileHeight() + this.getOffsetY();
    }
    
    isWater() {
        return this._getTopTile().water;
    }

    isSlope() {
        return this._getTopTile().slope;
    }

    getOrientation() {
        return this._getTopTile().orientation;
    }
}