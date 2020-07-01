class MenuController {
    constructor() {
        this.scene = null;
    }
    
    update(step) {
        this.scene.update(step);
    }

    render(delta) {
        this.scene.render(delta);
    }

    // -----------------------
    // Game State Transitioning
    // -----------------------

    async load() {
        this.scene = Data.getScene('test');
        await this.scene.load();
    }

    async initialize() {
    }
}