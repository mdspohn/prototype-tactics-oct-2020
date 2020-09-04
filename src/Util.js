class GameUtil {
    constructor() {
    }

    // ------------------------
    // ORIENTATION BETWEEN TWO TARGETS
    // ---------------------------------------

    getOrientationTo(target, location) {
        const DX = (target.x - location.x),
              DY = (target.y - location.y);
        
        return [
            ['north', -DX],
            ['south', +DX],
            ['east',  +DY],
            ['west',  -DY]
        ].sort((a, b) => b[1] - a[1])[0][0];
    }

    // ----------------------
    // OPPOSITE ORIENTATION
    // --------------------------------

    getOppositeOrientation(orientation) {
        switch(orientation) {
            case 'north':
                return 'south';
            case 'east':
                return 'west';
            case 'south':
                return 'north';
            case 'west':
                return 'east';
            default:
                console.warn('Util.getOppositeOrientation() did not receive valid orientation:', orientation);
        }
    }
}