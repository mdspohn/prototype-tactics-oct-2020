class GameManager {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // managers
        this.input  = new InputManager();
        this.camera = new Camera(this.canvas);
        this.transition = null;

        // state controllers
        this.controllers = new Array(4);
        this.controllers[0] = new MenuController();
        this.controllers[1] = new CombatController();
        this.controllers[2] = new TownController();
        this.controllers[3] = new WorldController();

        // game states
        this.states = new Object();
        this.states['MENU'] = 0;
        this.states['COMBAT'] = 1;
        this.states['TOWN'] = 2;
        this.states['WORLD'] = 3;

        this.state = null; // <0-3>
        this.scene = null;

        // --------------
        // XXX - DEVELOPMENT ONLY
        // -----------------------

        this.tools = new DevTools();
    }

    // -------------------
    // Game Initialization / Scene Transition
    // -----------------------------------

    async _load() {
        await Data._load();
        await Promise.all([...this.controllers.map(controller => controller._load())]);
        await this._prepare('test');
        await this._initialize();
    }

    async _prepare(sceneId) {
        this.scene = Data.getScene(sceneId);
        await this.controllers[this.states[this.scene.type]]._prepare(this.scene);
    }

    async _initialize() {
        await this.controllers[this.states[this.scene.type]]._initialize();
        this.state = this.states[this.scene.type];
        this.controllers[this.states[this.scene.type]].start();
    }
    
    update(step) {
        this.camera.update(step);
        this.input.update(step)
        this.controllers[this.state].update(step);

        // --------------
        // XXX - DEVELOPMENT ONLY
        // -----------------------

        this.tools.update(step);
    }

    render(delta) {
        this.camera.render(delta);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.controllers[this.state].render(delta);

        // --------------
        // XXX - DEVELOPMENT ONLY
        // -----------------------

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