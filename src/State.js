class StateController {
    constructor() {
        this.scene = null;
    }

    // -----------------------
    // Engine Loop
    // -----------------------

    update(step) {
        this.scene.update(step);
    }

    render(delta) {
        this.scene.render(delta);
    }

    // -----------------------
    // Game State Transitioning
    // -----------------------

    async prepare() {
        this.scene = Data.getScene('test');
        await this.scene.load();
    }

    async initialize() {
        await Game.camera.toCenter();
    }
}