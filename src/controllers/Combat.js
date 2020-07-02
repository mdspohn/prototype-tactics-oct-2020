class CombatController {
    constructor() {
        this.map = null;
        this.entities = null;
        this.layout = null;
    }

    async _prepare(scene) {
        this.map = scene.map;
        this.entities = scene.entities;
        this.layout = scene.layout;
    }

    async _initialize() {
        // todo
    }
    
    update(step) {
        this.map.update(step);
        this.entities.forEach(entity => entity.update(step));
    }

    render(delta) {
        this.layout.forEach(location => {
            this.map.renderTile(delta, location);
            // this.renderIndicator(delta, location);
            this.map.renderDecoration(delta, location);
            if (location.occupant != undefined)
                location.occupant.render(delta, location);
        });
    }
}