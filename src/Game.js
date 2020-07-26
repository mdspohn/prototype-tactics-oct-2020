class GameManager {
    constructor() {
        // canvas context
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.input  = new InputManager();
        this.camera = new Camera(this.canvas);
        this.scene  = new SceneLoader();

        //this.inventory = new InventoryManager();
        this.equipment = new EquipmentManager();

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

        this.frames = 0;
        this.elapsed = 0;
        this.fpsCounter = document.getElementById('fps-counter');

        // document events for camera
        window.addEventListener('resize', () => this.camera._resizeCanvas(this.canvas));
        window.addEventListener('fullscreenchange', () => this.camera._resizeCanvas(this.canvas));
    }

    async _prepare() {
        await this.scene._prepare('arena');
        await this.controllers[this.types[this.scene.type]]._prepare();
        await this._initialize();
    }

    async _initialize() {
        await this.controllers[this.types[this.scene.type]]._initialize(this.scene);
        this.camera.toCenter(this.canvas, this.controllers[this.types[this.scene.type]].layout);
        this.state = this.types[this.scene.type];
    }

    onClick(event) {
        this.controllers[this.state].onClick(event);
    }
    onRightClick(event) {
        this.controllers[this.state].onRightClick(event);
    }
    onKeyUp(event) {
        this.controllers[this.state].onKeyUp(event);
    }
    
    update(step) {
        this.input.update(step)
        this.camera.update(step);
        this.controllers[this.state].update(step);

        // fps counter
        this.elapsed += step;
        if (this.elapsed > 1000) {
            this.fpsCounter.innerText = this.frames;
            this.elapsed -= 1000;
            this.frames = 0;
        }
    }

    render(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.controllers[this.state].render(delta);

        // fps counter
        this.frames += 1;
    }
}