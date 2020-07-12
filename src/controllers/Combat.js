class CombatController {
    constructor() {
        // current scene objects
        this.map = null;
        this.decoration = null;
        this.entities = null;
        this.layout = null;

        // combat helpers
        this.markers = null;
    }

    async _prepare() {
        // combat helpers for visually representing available actions to player
        if (this.markers == null) {
            // tile markers for movement or attack targets
            this.markers = new TileMarkers();
            await this.markers._prepare();
        }
    }

    async _initialize(scene) {
        this.map = scene.map;
        this.decoration = scene.decoration;
        this.entities = scene.entities;
        this.layout = new Layout(this.map, this.entities);
    }
    
    update(step) {
        this.map.update(step);
        this.decoration.update(step);
        this.entities.forEach(entity => entity.update(step));
    }

    render(delta) {
        this.layout.forEach(location => {
            this.map.render(delta, location);
            this.markers.render(delta, location);
            this.decoration.render(delta, location);
            location.getOccupants().forEach(occupant => occupant.render(delta, location));
        });
    }
}