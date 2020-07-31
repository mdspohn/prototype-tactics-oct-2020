class CombatInterface {
    constructor() {

    }

    updateTurnOrder(order) {
        console.table(order.new);
    }
}

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
        this.interface = new CombatInterface();

        Events.listen('turn-order', data => this.interface.updateTurnOrder(data), true);
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
    }

    async _initialize() {
        this.entities.forEach(entity =>  entity.reset(this.layout.getLocation(entity.initialX, entity.initialY)));
        this.turns.use(this.entities);
        // set initial settings before game swaps to rendering this controller
    }

    start() {
        Game.camera.toCenter(Game.canvas, this.layout);
        this.nextTurn();
    }

    nextTurn() {
        this.turns.next();
        this.indicators.display('movement', this.turns.active.getRange(this.layout, this.entities));
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
        this.indicators.update(step);
    }

    render(delta) {
        this.layout.forEach(location => {
            this.map.render(delta, location);
            this.indicators.render(delta, location);
            this.decoration.render(delta, location);
            location.getOccupants().forEach(occupant => occupant.render(delta, location));
        });
    }

    onClick(event) {
        this.turns.active.walkTo(Game.camera.windowToTile(event.x, event.y, this.layout), this.layout);
    }

    onRightClick(event) {

    }

    onKeyUp(event) {

    }
}