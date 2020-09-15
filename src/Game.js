class GameManager {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.speed = 2;
        this.scaling = 4;
        
        // managers
        this.input  = new InputManager();
        this.camera = new Camera({ canvas: this.canvas, ctx: this.ctx, scaling: this.scaling });
        this.tools  = new DevTools();
        this.logic  = new LogicManager();
        this.views  = new ViewManager({ speed: this.speed, scaling: this.scaling });

        // state controllers
        this.controllers = new Array(4);
        this.controllers[0] = new TitleController();
        this.controllers[1] = new CombatController();
        this.controllers[2] = new TownController();
        this.controllers[3] = new WorldController();

        // game states
        this.states = new Object();
        this.states['TITLE']  = 0;
        this.states['COMBAT'] = 1;
        this.states['TOWN']   = 2;
        this.states['WORLD']  = 3;

        this.state = null; // <0-3>

        // upcoming/active scene
        this.scene = null;
        this.map = null;
        this.decoration = null;
        this.entities = null;
    }

    // -------------------
    // Game Initialization / Scene Transition
    // -----------------------------------

    async _load() {
        await Assets._load();
        await Promise.all([...this.controllers.map(controller => controller._load())]);

        // --------------
        // XXX - This should be done when transitioning, not on game load
        // -----------------------
        await this._prepare('test');
        await this._initialize();
    }

    async _prepare(id) {
        this.scene = Assets.getScene(id);

        if (this.map !== null)
            this.map._destroy();

        this.map = this.scene.map;
        this.decoration = this.scene.decoration;
        this.entities = this.scene.entities;

        await this.controllers[this.states[this.scene.type]]._prepare(this.map, this.decoration, this.entities);
    }

    async _initialize() {
        this.state = this.states[this.scene.type];
        this.controllers[this.states[this.scene.type]]._initialize();
    }
    
    update(step) {
        this.input.update(step);
        this.camera.update(step);
        this.controllers[this.state].update(step);
        this.tools.update(step);
    }

    render(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera.render(delta);
        this.controllers[this.state].render(delta);
        this.tools.render(delta);
    }

    // --------------------
    // User Input Mediation
    // ----------------------------

    onMouseMove(event) {
        this.controllers[this.state].onMouseMove(event);
    }

    onMouseWheel(event) {
        this.controllers[this.state].onMouseWheel(event);
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
}