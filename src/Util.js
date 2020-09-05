class GameUtil {
    constructor() {
        this.ORIENTATIONS = new Object();
        this.ORIENTATIONS.NORTH = 'north';
        this.ORIENTATIONS.EAST  = 'east';
        this.ORIENTATIONS.SOUTH = 'south';
        this.ORIENTATIONS.WEST  = 'west';
    }

    // ------------------------
    // ORIENTATION BETWEEN TWO TARGETS
    // @target <Location>
    // @from <Location>
    // ---------------------------------------

    getOrientationTo(target, from) {
        const DX = (target.x - from.x),
              DY = (target.y - from.y);
        
        return [
            [this.ORIENTATIONS.NORTH, -DX],
            [this.ORIENTATIONS.SOUTH, +DX],
            [this.ORIENTATIONS.EAST,  +DY],
            [this.ORIENTATIONS.WEST,  -DY]
        ].sort((a, b) => b[1] - a[1])[0][0];
    }

    // ----------------------
    // OPPOSITE ORIENTATION
    // @orientation <String>
    // --------------------------------

    getOppositeOrientation(orientation) {
        switch(orientation) {
            case this.ORIENTATIONS.NORTH:
                return this.ORIENTATIONS.SOUTH;
            case this.ORIENTATIONS.EAST:
                return this.ORIENTATIONS.WEST;
            case this.ORIENTATIONS.SOUTH:
                return this.ORIENTATIONS.NORTH;
            case this.ORIENTATIONS.WEST:
                return this.ORIENTATIONS.EAST;
            default:
                console.warn('Util.getOppositeOrientation() did not receive valid orientation:', orientation);
        }
    }
}