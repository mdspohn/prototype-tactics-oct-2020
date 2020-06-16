class GameManager {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.controllers = new Object();
        this.controllers[0] = new CombatController();

        this.state = null;
        this.input = new InputManager();
        this.camera = new Camera();
    }
    
    update(step) {
        this.input.update(step);
        this.camera.update(step);
        this.controllers[this.state].update(step);
    }

    render(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.controllers[this.state].render(delta);
    }

    _handleInput(code, event) {
        if (this.state != null)
            this.controllers[this.state]._handleInput(code, event);
    }
    
    async prepare(state, opts) {
        await this.controllers[state].prepare(opts);
    }

    async changeTo(state) {
        let opts = null;

        if (this.state != null)
            opts = await this.controllers[this.state].finalize(state);

        this.state = state;
        this.controllers[state].initialize(opts);
    }
}