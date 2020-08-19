class CombatTurns {
    constructor() {
    }

    _entityCanTakeTurn(entity) {
        return entity.health > 0;
    }

    _entityIsReady(entity, cycles) {
        const energy = entity.energy + (entity.speed * cycles),
              energized = energy >= 100,
              isNewlyEnergized = Math.floor(energy / 100) > Math.floor((energy - (entity.speed * 1)) / 100);

        return energized && isNewlyEnergized;
    }

    getNext(entities) {
        let next = entities.find(entity => entity.energy >= 100);
        while (next === undefined) {
            const ready = [];
            entities.forEach(entity => {
                if (this._entityCanTakeTurn(entity)) {
                    entity.energy += entity.speed;
                    
                    if (entity.energy >= 100)
                        ready.push(entity);
                }
            });

            ready.sort((a, b) => b.energy - a.energy);
            next = ready[0];
        }
        next.energy -= 100;
        return next;
    }

    getForecast(entities, count = 7) {
        const forecast = [];
        let cycles = 0;

        while (forecast.length < count) {
            const ready = [];

            entities.forEach(entity => {
                if (this._entityCanTakeTurn(entity) && this._entityIsReady(entity, cycles))
                    ready.push({ entity, energy: (entity.energy + (entity.speed * cycles)) % 100 });
            });

            ready.sort((a, b) => (b.energy % 100) - (a.energy % 100));
            ready.forEach(energized => forecast.push(energized.entity));
            cycles += 1;
        }

        return forecast.slice(0, count);
    }
}