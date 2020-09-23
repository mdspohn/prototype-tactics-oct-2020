class GameManager {
    constructor() {
        this.speed = 1;
        this.scaling = 4;

        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.camera = new Camera(this.canvas, this.ctx, this.scaling);
        
        this.input  = new InputManager();
        this.tools  = new DevTools();

        // managers for retrieving, loading, and saving game object data
        this.managers = new Object();
        this.managers.data        = new DataManager();
        this.managers.scenes      = new SceneManager();
        this.managers.maps        = new MapManager();
        this.managers.decorations = new DecorationManager();
        this.managers.beasts      = new BeastManager();
        this.managers.equipment   = new EquipmentManager();
        this.managers.effects     = new EffectManager();
        this.managers.sounds      = new SoundManager();

        // object renderers
        this.renderers = new Object();
        this.renderers.maps        = new MapRenderer();
        this.renderers.decorations = new DecorationRenderer();
        this.renderers.beasts      = new BeastRenderer();
        this.renderers.effects     = new EffectRenderer();

        // mediators 
        this.views = new Views(this.renderers, this.speed, this.scaling);
        this.actions = new Actions(this.managers);

        // state controllers
        this.controllers = new Array(4);
        this.controllers[0] = new TitleController(this.views, this.actions);
        this.controllers[1] = new CombatController(this.views, this.actions);
        this.controllers[2] = new TownController(this.views, this.actions);
        this.controllers[3] = new WorldController(this.views, this.actions);


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
        this.beasts = null;
    }

    // -------------------
    // Game Initialization / Scene Transition
    // -----------------------------------

    async load() {
        await Promise.all([
            ...Object.values(this.managers).map(manager => manager.load()),
            ...this.controllers.map(controller => controller.load())
        ]);

        // --------------
        // XXX - This should be done when transitioning, not on game load
        // -----------------------
        await this.prepare('test');
        await this.initialize();
    }

    async prepare(id) {
        this.scene = this.managers.scenes.get(id);
        this.map = this.managers.maps.get(this.scene.map);
        this.decoration = this.managers.decorations.get(this.scene.decoration);
        this.beasts = this.scene.beasts.map(beast => this.managers.beasts.get(beast.id, beast));

        await this.controllers[this.states[this.scene.type]].prepare(this.map, this.decoration, this.beasts);
    }

    async initialize() {
        this.state = this.states[this.scene.type];
        this.controllers[this.states[this.scene.type]].initialize();
    }
    
    update(step) {
        this.input.update(step);
        this.camera.update(step);
        this.tools.update(step);
        this.controllers[this.state].update(step);
    }

    render(delta) {
        this.camera.render(delta);
        this.tools.render(delta);
        this.controllers[this.state].render(delta, this.canvas, this.ctx, this.camera);
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