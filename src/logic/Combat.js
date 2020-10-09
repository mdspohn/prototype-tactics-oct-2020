class CombatLogic {
    static ORIENTATIONS = {
        NORTH: 'north',
        EAST: 'east',
        SOUTH: 'south',
        WEST: 'west'
    };

    // ------------------------
    // ORIENTATIONS
    // ------------------------------------------

    static getNextLocation(map, location, orientation) {
        switch (orientation) {
            case CombatLogic.ORIENTATIONS.NORTH:
                return map.getLocation(location.x - 1, location.y);
            case CombatLogic.ORIENTATIONS.SOUTH:
                return map.getLocation(location.x + 1, location.y);
            case CombatLogic.ORIENTATIONS.EAST:
                return map.getLocation(location.x, location.y + 1);
            case CombatLogic.ORIENTATIONS.WEST:
                return map.getLocation(location.x, location.y - 1);
        }
    }

    static getOrientation(from, to) {
        const DX = to.x - from.x,
              DY = to.y - from.y;
        
        return [
            [CombatLogic.ORIENTATIONS.NORTH, -DX],
            [CombatLogic.ORIENTATIONS.SOUTH, +DX],
            [CombatLogic.ORIENTATIONS.EAST,  +DY],
            [CombatLogic.ORIENTATIONS.WEST,  -DY]
        ].sort((a, b) => b[1] - a[1])[0][0];
    }

    static getOrientationToCoords(unit, x, y) {
        const unitX = Game.camera.getPosX() + ((unit.location.posX + (unit.location.tw / 2)) * Game.scaling),
              unitY = Game.camera.getPosY() + ((unit.location.posY + (unit.location.td / 2)) * Game.scaling);

        if (unitX - x > 0) {
            return (unitY - y > 0) ? CombatLogic.ORIENTATIONS.WEST : CombatLogic.ORIENTATIONS.SOUTH;
        } else {
            return (unitY - y > 0) ? CombatLogic.ORIENTATIONS.NORTH : CombatLogic.ORIENTATIONS.EAST;
        }
    }
    
    static getKnockbackTile(attacker, defender, map) {
        switch (CombatLogic.getOrientation(attacker.location, defender.location)) {
            case CombatLogic.ORIENTATIONS.NORTH:
                return map.getLocation(defender.location.x - 1, defender.location.y);
            case CombatLogic.ORIENTATIONS.SOUTH:
                return map.getLocation(defender.location.x + 1, defender.location.y);
            case CombatLogic.ORIENTATIONS.EAST:
                return map.getLocation(defender.location.x, defender.location.y + 1);
            case CombatLogic.ORIENTATIONS.WEST:
                return map.getLocation(defender.location.x, defender.location.y - 1);
        }
    }

    static getOppositeOrientation(orientation) {
        switch(orientation) {
            case CombatLogic.ORIENTATIONS.NORTH:
                return CombatLogic.ORIENTATIONS.SOUTH;
            case CombatLogic.ORIENTATIONS.SOUTH:
                return CombatLogic.ORIENTATIONS.NORTH;
            case CombatLogic.ORIENTATIONS.EAST:
                return CombatLogic.ORIENTATIONS.WEST;
            case CombatLogic.ORIENTATIONS.WEST:
                return CombatLogic.ORIENTATIONS.EAST;
        }
    }
}