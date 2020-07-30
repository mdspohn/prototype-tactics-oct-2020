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
        // COMBAT STATE
        // -----------------------

        this.turns = new TurnManager();
        this.indicators = new CombatIndicators();

        Events.listen('turn-order', (data) => console.log(data), true);
        Events.listen('turn-end', () => this.nextTurn());
    }

    async _load() {
        await this.indicators._load();
    }

    async _prepare(scene) {
        this.map = scene.map;
        this.decoration = scene.decoration;
        this.entities = scene.entities;
        this.layout = new Layout(this.map, this.entities);
        this.entities.forEach(entity => {
            entity.reset(this.layout.getLocation(entity.initialX, entity.initialY));
        });
    }

    async _initialize() {
        this.turns.use(this.entities);
        // set initial settings before game swaps to rendering this controller
    }

    start() {
        Game.camera.toCenter(Game.canvas, this.layout);
        this.nextTurn();
    }

    nextTurn() {
        this.turns.next();
        console.log(this.turns.active)
        this.turns.active.startTurn();
    }

    // -------------------
    // ENGINE LOOP
    // --------------------------
    
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