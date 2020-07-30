class CombatController {
    constructor() {
        // ----------------
        // SCENE
        // --------------------

        this.map = null;
        this.decoration = null;
        this.entities = null;
        this.layout = null;

        // -------------------
        // TURN ORDER
        // -----------------------

        this.active = null;
        this.turns = [];
    }

    async _load() {
        //await this.markers._load();
    }

    async _prepare(scene) {
        this.map = scene.map;
        this.decoration = scene.decoration;
        this.entities = scene.entities;
        this.layout = new Layout(this.map, this.entities);
        this.entities.forEach(entity => {
            entity.energy = 0;
            entity.location = this.layout.getLocation(entity.x(), entity.y());
        });
    }

    async _initialize() {
        //this.turns = new TurnManager(this.entities);
    }

    start() {
        Game.camera.toCenter(Game.canvas, this.layout);
        //this.turns.next();
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
            //this.markers.render(delta, location);
            this.decoration.render(delta, location);
            location.getOccupants().forEach(occupant => occupant.render(delta, location));
        });
    }

    onClick(event) {

    }

    onRightClick(event) {

    }

    onKeyUp(event) {

    }
}