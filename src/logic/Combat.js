class CombatLogic {
    static get NORTH() { return 'north'; }
    static get EAST()  { return 'east';  }
    static get SOUTH() { return 'south'; }
    static get WEST()  { return 'west';  }

    static getLocation(map, location, orientation, offset = 1) {
        const x = location.x + ((orientation === this.SOUTH) - (orientation === this.NORTH)) * offset,
              y = location.y + ((orientation === this.EAST) - (orientation === this.WEST))   * offset;

        return map.getLocation(x, y);
    }

    static getOrientation(from, to) {
        const DX = to.x - from.x,
              DY = to.y - from.y;
        
        return [ [this.NORTH, -DX], [this.SOUTH, +DX], [this.EAST, +DY], [this.WEST, -DY] ].sort((a, b) => b[1] - a[1])[0][0];
    }

    static getOrientationToCoords(unit, x, y) {
        const unitX = Game.camera.getPosX() + ((unit.location.posX + (unit.location.tw / 2)) * Game.scaling),
              unitY = Game.camera.getPosY() + ((unit.location.posY + (unit.location.td / 2)) * Game.scaling);

        return (unitX - x > 0) ? ((unitY - y > 0) ? this.WEST : this.SOUTH) : ((unitY - y > 0) ? this.NORTH : this.EAST);
    }

    static getOppositeOrientation(orientation) {
        switch(orientation) {
            case this.NORTH:
                return this.SOUTH;
            case this.SOUTH:
                return this.NORTH;
            case this.EAST:
                return this.WEST;
            case this.WEST:
                return this.EAST;
        }
    }

    static getTurnOrder(beasts, amount = 7) {
        let counter = 0;

        const turns = new Array();
        while (turns.length < amount) {
            const available = beasts.filter(beast => {
                const energy = beast.energy + (beast.stats.current.speed * counter),
                      isReady = energy >= 100,
                      isNewlyReady = Math.floor(energy / 100) > Math.floor((energy - (beast.stats.current.speed * 1)) / 100);

                return beast.isAlive() && isReady && isNewlyReady;
            }).sort((a, b) => ((b.energy + b.stats.current.speed * counter) % 100) - ((a.energy + a.stats.current.speed * counter) % 100));

            counter += 1;
            turns.push(...available);
        }

        return turns.slice(0, amount);
    }
}