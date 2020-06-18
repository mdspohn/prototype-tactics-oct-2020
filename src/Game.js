class GameManager {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.input = new InputManager();
        this.camera = new Camera();
        this.controller = new StateController();
    }
    
    update(step) {
        this.input.update(step);
        this.camera.update(step);
        this.controller.update(step);
    }

    render(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.controller.render(delta);
    }
    
    async prepare() {
        await this.controller.prepare();
        this.camera.initialize();
        await this.controller.initialize();
    }
}