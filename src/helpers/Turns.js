class TurnManager {
    constructor() {
        this.entities = null;
        this.order = [];
        this.active = null;

        Events.listen('speed-change', (entities) => {
            this.forecast();
        }, true);
        Events.listen('death', (entity) => {
            this.forecast();
            if (entity === this.active)
                this.next();
        }, true);
    }

    use(entities) {
        this.entities = entities;
        this.forecast();
    }

    forecast(count = 6) {
        let order = new Array(),
            cycles = 0;

        while (order.length < count) {
            const energized = [];
            cycles += 1;

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
        }

        Events.dispatch('turn-order', { old: this.order, new: order });
        this.order = order;
    }

    next() {
        this.active = this.order.shift();
        this.active.energy = ((Math.ceil((100 - this.active.energy) / this.active.speed) * this.active.speed) + this.active.energy) % 100;
        this.forecast();
    }

}