class CombatLogic {

    static ORIENTATIONS = {
        NORTH: 'north',
        EAST: 'east',
        SOUTH: 'south',
        WEST: 'west'
    };

    static ALLEGIANCES = {
        SELF: 'self',
        ALLY: 'ally',
        NEUTRAL: 'neutral',
        FOE: 'foe'
    };

    // ------------------------
    // ORIENTATIONS
    // ------------------------------------------

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

    // -------------------------
    // ALLEGIANCES
    // ------------------------------------
    
    static getAllegiance(from, to) {
        if (from === to)
            return CombatLogic.ALLEGIANCES.SELF;
        
        const a1 = ~~from?.allegiance,
              a2 = ~~to?.allegiance,
              difference = Math.abs(a1 - a2);

        switch(difference) {
            case 0:
                return CombatLogic.ALLEGIANCES.ALLY;
            case 1:
                return CombatLogic.ALLEGIANCES.NEUTRAL;
            case 2:
                return CombatLogic.ALLEGIANCES.FOE;
        }
    }

    // --------------------------
    // TURNS
    // ---------------------------------------

    static getTurns(units, count = 7) {
        let loops = 0,
            turns = new Array();

        while (turns.length < count) {
            const ready = units.filter(unit => CombatLogic._isReady(unit, loops));
            ready.sort((a, b) => ((b.energy + (b.speed * loops)) % 100) - ((a.energy + (a.speed * loops)) % 100));

            loops += 1;
            turns.push(...ready);
        }

        return turns.slice(0, count);
    }

    static getNextTurn(units) {
        let next = units.find(unit => unit.energy >= 100);

        while (next === undefined) {
            const ready = units.filter(unit => {
                if (BeastLogic.isAlive(unit)) {
                    unit.energy += unit.speed;
                    return unit.energy >= 100;
                }
                return false;
            });
            ready.sort((a, b) => b.energy - a.energy);
            next = ready[0];
        }
        next.energy -= 100;
        return next;
    }

    static _isReady(unit, loops) {
        if (!BeastLogic.isAlive(unit))
            return false;
        
        const energy = entity.energy + (entity.speed * loops),
              energized = energy >= 100,
              isNewlyEnergized = Math.floor(energy / 100) > Math.floor((energy - (entity.speed * 1)) / 100);

        return energized && isNewlyEnergized;
    }
}