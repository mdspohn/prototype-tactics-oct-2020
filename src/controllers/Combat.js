class CombatController {
    constructor() {
        this.map = null;
    }

    async _use(scene) {
        this.map = scene.map;
    }

    async _initialize() {
        // todo
    }
    
    update(step) {
        this.map.update(step);
    }

    render(delta) {
        this.map.structure.forEach(location => {
            this.map.render(delta, location);
            // this.map.decorations.render(delta, location);
            // this.map.objects.render(delta, location);
            // this.entities.ally.forEach(entity => entity.render(delta, location));
            // this.entities.neutral.forEach(entity => entity.render(delta, location));
            // this.entities.enemy.forEach(entity => entity.render(delta, location));
        });
    }
}