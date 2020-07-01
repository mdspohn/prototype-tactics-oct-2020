class GameManager {
    constructor() {
        // canvas contexts
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.input = new InputManager();
        //this.transitions = new TransitionManager();
        this.camera = new Camera();

        this.controllers = new Array(3);
        this.controllers[0] = new MenuController();
        this.controllers[1] = new CombatController();
        this.controllers[2] = new TownController();

        this.state = new Object();
        this.state['MENU'] = 0;
        this.state['COMBAT'] = 1;
        this.state['TOWN'] = 2;

        // state
        this.next = null;
        this.current = null;

        // document events for camera
        window.addEventListener('resize', () => this.camera._resizeCanvas(this.canvas));
        window.addEventListener('fullscreenchange', () => this.camera._resizeCanvas(this.canvas));
    }

    async _prepare() {
        await this.load();
        await this.initialize();
    }

    async load() {
        await this.controllers[this.state['COMBAT']].load();
    }

    async initialize() {
        await this.controllers[this.state['COMBAT']].initialize();
        this.camera.initialize(this.canvas);
        this.camera.toCenter(this.canvas, this.controllers[this.state['COMBAT']].getMap());
    }
    
    update(step) {
        this.input.update(step)
        this.camera.update(step);
        this.controllers[this.state['COMBAT']].update(step);
    }

    render(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.controllers[this.state['COMBAT']].render(delta);
    }
}