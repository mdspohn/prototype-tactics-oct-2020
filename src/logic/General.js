class GeneralLogic {
    static getOrientationTo(target, from) {
        const DX = (target.x - from.x),
              DY = (target.y - from.y);
        
        return [
            ['north', -DX],
            ['south', +DX],
            ['east',  +DY],
            ['west',  -DY]
        ].sort((a, b) => b[1] - a[1])[0][0];
    }

    static getOppositeOrientation(orientation) {
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

    static getAllegiance(beast1, beast2) {
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