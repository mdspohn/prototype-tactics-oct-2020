class GameUtil {
    constructor() {
        this.ORIENTATIONS = new Object();
        this.ORIENTATIONS.NORTH = 'north';
        this.ORIENTATIONS.EAST  = 'east';
        this.ORIENTATIONS.SOUTH = 'south';
        this.ORIENTATIONS.WEST  = 'west';
    }

    // ------------------------
    // GET ORIENTATION BETWEEN TWO TARGETS
    // >> <String> ['north', 'south', 'east', 'west']
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
    // GET OPPOSITE ORIENTATION
    // >> <String> ['north', 'south', 'east', 'west']
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

    
    // ----------------------
    // GET ALLEGIANCE
    // >> <String> ['SELF', 'ALLY', 'NEUTRAL', 'FOE']
    // @beast1 <Beast>
    // @beast2 <Beast>
    // --------------------------------

    getAllegiance(beast1, beast2) {
        if (beast1 === beast2)
            return 'SELF';
        
        const beast1_a = ~~beast1?.allegiance,
              beast2_a = ~~beast2?.allegiance,
              difference = Math.abs(beast1_a - beast2_a);

        switch(difference) {
            case 0:
                return 'ALLY';
            case 1:
                return 'NEUTRAL';
            case 2:
                return 'FOE';
        }
    }
}