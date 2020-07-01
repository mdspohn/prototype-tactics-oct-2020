class CombatController {
    constructor() {
        this.next = null;
        this.scene = null;
    }

    async load() {
        this.next = Data.getScene('test');
        await this.next.load();
    }

    async initialize() {
        this.scene = this.next;
    }
    
    update(step) {
        this.scene.update(step);
    }

    render(delta) {
        this.scene.render(delta);
    }

    // -----------------------
    // Helper Functions
    // -----------------------

    getMap() {
        return this.scene.map;
    }
}