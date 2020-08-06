class TurnManager {
    constructor() {
        this.entities = null;
        this.order = [];
        this.active = null;
    }

    use(entities) {
        this.entities = entities;
    }

    _getNext() {
        let next = (this.order[0].energy >= 100) ? this.order[0] : undefined;
        while (next === undefined) {
            const energized = [];
            this.entities.forEach(entity => {
                if (entity.health <= 0)
                    return;

                entity.energy += entity.speed;
                
                if (entity.energy >= 100)
                    energized.push(entity);
            });

            energized.sort((a, b) => b.energy - a.energy);
            next = energized[0];
        }
        return next;
    }

    forecast(count = 7) {
        let order = new Array(),
            cycles = 0;

        while (order.length < count) {
            const energized = [];

            this.entities.forEach(entity => {
                if (entity.health <= 0)
                    return;

                const energy   = entity.energy + (entity.speed * cycles),
                      p_energy = energy - (entity.speed * 1);
                
                if (energy >= 100 && Math.floor(energy / 100) > Math.floor(p_energy / 100))
                    energized.push({ energy: (energy % 100), entity });
            });

            energized.sort((a, b) => (b.energy % 100) - (a.energy % 100));
            energized.forEach(item => order.push(item.entity));
            cycles += 1;
        }

        Events.dispatch('turn-order', { old: this.order, new: order.slice(0, count) });
        this.order = order.slice(0, count);
    }

    next() {
        this.active = this._getNext();
        this.active.energy -= 100;
        this.forecast();
    }

}