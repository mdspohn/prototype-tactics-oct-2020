class GameManager {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.input = new InputManager();
        this.camera = new Camera();
        this.state = new StateController();
    }
    
    update(step) {
        this.input.update(step);
        this.camera.update(step);
        this.state.update(step);
    }

    render(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.state.render(delta);
    }
    
    async prepare() {
        await this.state.prepare();
        this.camera.initialize();
        await this.state.initialize();
    }

    getMap() {
        return this.state.scene.map;
    }
}