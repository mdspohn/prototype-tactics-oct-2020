class CombatController {
    constructor() {
        // current scene objects
        this.map = null;
        this.decoration = null;
        this.entities = null;
        this.layout = null;

        // combat helpers
        this.markers = null;
        this.cutscene = null;
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
        this.entities.forEach(entity => entity.location = this.layout.getLocation(entity.x(), entity.y()));
        this.entities[0].moveTo(this.layout.getLocation(5,0));
        this.entities[0].moveTo(this.layout.getLocation(4,0));
        this.entities[0].moveTo(this.layout.getLocation(3,0));
        this.entities[0].moveTo(this.layout.getLocation(2,0));
        this.entities[0].moveTo(this.layout.getLocation(3,0));
        this.entities[0].moveTo(this.layout.getLocation(4,0));
        this.entities[0].moveTo(this.layout.getLocation(5,0));
        this.entities[0].moveTo(this.layout.getLocation(6,0));
        this.entities[0].moveTo(this.layout.getLocation(6,1));
        this.entities[0].moveTo(this.layout.getLocation(5,1));
        this.entities[0].moveTo(this.layout.getLocation(5,2));
        this.entities[0].moveTo(this.layout.getLocation(5,3));
        this.entities[0].moveTo(this.layout.getLocation(5,4));
        this.entities[0].moveTo(this.layout.getLocation(4,4));
        this.entities[0].moveTo(this.layout.getLocation(3,4));
        this.entities[0].moveTo(this.layout.getLocation(4,4));
        this.entities[0].moveTo(this.layout.getLocation(5,4));
        this.entities[0].moveTo(this.layout.getLocation(6,4));
        this.entities[0].moveTo(this.layout.getLocation(7,4));
        // this.entities[0].moveTo(this.layout.getLocation(6,1));
        // this.entities[0].moveTo(this.layout.getLocation(5,1));
        // this.entities[0].moveTo(this.layout.getLocation(5,2));
        // this.entities[0].moveTo(this.layout.getLocation(5,3));
        // this.entities[0].moveTo(this.layout.getLocation(5,4));
        // this.entities[0].moveTo(this.layout.getLocation(4,4));
        // this.entities[0].moveTo(this.layout.getLocation(3,4));
        // this.entities[0].moveTo(this.layout.getLocation(2,4));
        // this.entities[0].moveTo(this.layout.getLocation(1,4));
        // this.entities[0].moveTo(this.layout.getLocation(0,4));
        // this.entities[0].moveTo(this.layout.getLocation(0,3));
        // this.entities[0].moveTo(this.layout.getLocation(0,2));
        // this.entities[0].moveTo(this.layout.getLocation(0,1));
        // this.entities[0].moveTo(this.layout.getLocation(0,0));
        // this.entities[0].moveTo(this.layout.getLocation(0,1));
        // this.entities[0].moveTo(this.layout.getLocation(0,2));
        // this.entities[0].moveTo(this.layout.getLocation(0,3));
        // this.entities[0].moveTo(this.layout.getLocation(0,4));
    }

    onClick(event) {
        //this.map.replace(1,4, 15);
    }

    onRightClick(event) {
        //this.map.add(3,3, 10);
    }

    onKeyUp(event) {
        //this.map.replace(1,1, 4,4,4,5);
        //this.decoration.remove(1,2);
    }
    
    update(step) {
        this.layout.forEach(location => {
            this.map.update(step, location);
            this.decoration.update(step, location);
        });
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