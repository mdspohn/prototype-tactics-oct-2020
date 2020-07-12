class GameManager {
    constructor() {
        // canvas context
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.input  = new InputManager();
        this.camera = new Camera(this.canvas);
        this.scene  = new SceneLoader();

        this.controllers = new Array(4);
        this.controllers[0] = new MenuController();
        this.controllers[1] = new CombatController();
        this.controllers[2] = new TownController();
        this.controllers[3] = new WorldController();

        // game states dictionary
        this.types = new Object();
        this.types['MENU'] = 0;
        this.types['COMBAT'] = 1;
        this.types['TOWN'] = 2;
        this.types['WORLD'] = 3;

        this.state = null; // <0-3>

        // document events for camera
        window.addEventListener('resize', () => this.camera._resizeCanvas(this.canvas));
        window.addEventListener('fullscreenchange', () => this.camera._resizeCanvas(this.canvas));
    }

    async _prepare() {
        await this.scene._prepare('test');
        await this.controllers[this.types[this.scene.type]]._prepare();

        await this.controllers[this.types[this.scene.type]]._initialize(this.scene);
        this.camera.toCenter(this.canvas, this.controllers[this.types[this.scene.type]].layout);
        this.state = this.types[this.scene.type];
    }
    
    update(step) {
        this.input.update(step)
        this.camera.update(step);
        this.controllers[this.state].update(step);
    }

    render(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.controllers[this.state].render(delta);
    }
}