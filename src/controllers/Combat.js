class CombatController {
    constructor() {

        // ----------------
        // SCENE
        // --------------------
        
        this.interface = new CombatInterface();

        this.map = null;
        this.decoration = null;
        this.units = null;
        this.effects = null;

        this.active = null; // <Beast>
        this.range = new WeakMap();
        this.selection = new WeakMap();
        this.path = new Array();
        this.focus = null; // <Location>
        this.orientation = null; // <String>

        // -------------------
        // COMBAT STATE
        // -----------------------

        this.state = 0; // <0-29>

        this.states = new Object();
        this.states["NONE"]           = 0;
        this.states["AI_TURN"]        = 10;
        this.states["PLAYER_TURN"]    = 20;
        this.states["MOVE_REQUEST"]   = 21;
        this.states["MOVE_CONFIRM"]   = 22;
        this.states["ATTACK_REQUEST"] = 23;
        this.states["ATTACK_CONFIRM"] = 24;
        this.states["SKILLS_MENU"]    = 25;
        this.states["SKILL_REQUEST"]  = 26;
        this.states["SKILL_CONFIRM"]  = 27;
        this.states["WAIT_REQUEST"]   = 28;
        this.states["WAIT_CONFIRM"]   = 29;

        // -------------------
        // EVENT LISTENERS
        // -----------------------

        Events.listen('MOVE_REQUEST',   (event) => this.requestMove(event),   true);
        Events.listen('ATTACK_REQUEST', (event) => this.requestAttack(event), true);
        Events.listen('SKILLS_MENU',    (event) => this.skillsMenu(event),    true);
        Events.listen('WAIT_REQUEST',   (event) => this.requestWait(event),   true);
    }

    async _load() {
        await this.interface._load();
    }

    async _prepare(map, decoration, units) {
        this.map = map;
        this.decoration = decoration;
        this.units = units;
        this.units.forEach(unit => unit.initialize(this.map.getLocation(unit.initialX, unit.initialY)));
    }

    async _initialize() {
        Game.camera.toCenter(Game.canvas, this.map);
        this.nextTurn();
    }

    // -------------------
    // COMBAT STATE CHANGES
    // --------------------------

    async nextTurn() {
        this.active = CombatLogic.getNextTurn(this.units);
        this.active.resetTurn();
        this.interface.updateTurns(CombatLogic.getTurns(this.units), this.active);

        // pan camera to entity
        Game.camera.toLocation(this.active.location, 750, 'ease-out');

        // enable interface and new state
        await this.interface.nextTurn(this.active);
        this.state = this.states.PLAYER_TURN;
    }

    // -------------------
    // ENGINE HOOKS
    // --------------------------
    
    update(step) {
        Game.views.updateMap(step, this.map);
        Game.views.updateDecorations(step, this.decoration);
        Game.views.updateBeasts(step, this.units);
        Game.views.updateEffects(step, this.skills);

        this.interface.update(step);
    }

    render(delta) {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        const locations = this.map.getLocations();

        let restart = false;
        for (let i = 0; i < locations.length; i++) {
            Game.views.renderMap(delta, Game.ctx, Game.camera, locations[i], this.map);
            this.interface.renderMarkers(delta, Game.ctx, Game.camera, locations[i], this.range, this.path, this.selection, this.focus);
            Game.views.renderDecorations(delta, Game.ctx, Game.camera, locations[i], this.decoration);
            restart = Game.views.renderBeasts(delta, Game.ctx, Game.camera, locations[i], this.units);
            if (restart)
                break;
        }

        if (restart)
            return this.render(delta);
        
        this.interface.renderOrientation(delta, Game.ctx, Game.camera, this.active, this.orientation);
        this.interface.render(delta);
    }

    // -------------------
    // COMBAT ACTIONS
    // --------------------------

    requestMove(event) {
        if (this.state === this.states.MOVE_REQUEST)
            return this.cancelMove();
        
        if (this.state !== this.states.PLAYER_TURN || !this.active.canMove())
            return;

        this.state = this.states.MOVE_REQUEST;
        this.range = BeastLogic.getRange(this.active, this.units, this.map);
        this.interface.requestMove();
    }

    confirmMove(location) {
        if (location === undefined || !BeastLogic.isValidSelection(location, this.range))
            return;

        this.state = this.states.MOVE_CONFIRM;

        const stepListenerId = Events.listen('move-step', (beast) => {
            this.interface._updateHeight(beast.animation.destination.getZ());
        }, true);
        Game.actions.move(this.active, BeastLogic.getPath(location, this.range)).then(() => {
            this.active.hasMoved = true;
            this.state = this.states.PLAYER_TURN;
            this.interface.confirmMove(this.active.getMovement());
            this.interface._updateHeight(this.active.location.getZ());

            this.focus = null;
            this.path = new Array();

            Events.remove('move-step', stepListenerId);
        });
        this.range = new WeakMap();
    }

    cancelMove() {
        this.state = this.states.PLAYER_TURN;
        this.range = new WeakMap();
        this.path = new Array();
        this.interface.cancelMove();
    }

    resetMove() {
        if (this.active.checkpoint.last !== 0) {
            Game.actions.resetMove(this.active);
            this.interface.resetMove(this.active);
            this.requestMove();
        }
    }

    requestAttack(event) {
        if (this.state === this.states.ATTACK_REQUEST)
            return this.cancelAttack();
        
        if (this.state !== this.states.PLAYER_TURN || !this.active.canAttack())
            return;

        this.state = this.states.ATTACK_REQUEST;
    
        const attackRange = this.active.actions.basic.getRange(this.active, this.units, this.map);
        this.range = attackRange;
        this.interface.requestAttack();
    }

    confirmAttack(location) {

    }

    cancelAttack() {
        this.state = this.states.PLAYER_TURN;
        this.range = new WeakMap();
        this.selection = new WeakMap();
        this.interface.cancelAttack();
    }

    requestSkillsMenu(entity) {}

    requestSkill(entity) {}

    confirmSkill(entity) {}

    requestWait(event) {
        if (this.state !== this.states.PLAYER_TURN)
            return;
        this.orientation = this.active.orientation;
        this.state = this.states.WAIT_REQUEST;
    }

    confirmWait(event) {
        this.state = this.states.WAIT_CONFIRM;
        this.orientation = null;
        this.interface.endTurn().then(() => this.nextTurn());
    }

    cancelWait() {
        this.state = this.states.PLAYER_TURN;
        this.orientation = null;
    }

    _updateFocus(location) {
        if (this.focus === location)
            return;
        
        switch(this.state) {
            case this.states.MOVE_REQUEST:
                if (BeastLogic.isValidSelection(location, this.range)) {
                    this.focus = location;
                    this.path = BeastLogic.getPath(location, this.range);
                } else {
                    this.focus = null;
                    this.path = new Array();
                }
                break;
            case this.states.MOVE_CONFIRM:
                break;
            case this.states.ATTACK_REQUEST:
                if (BeastLogic.isInRange(location, this.range)) {
                    this.focus = location;
                } else {
                    this.focus = null;
                }
                break;
            default:
                this.focus = null;
        }
    }

    // -------------------
    // MOUSE INPUT MEDIATION
    // --------------------------

    onMouseMove(event) {
        let location = Game.camera._windowToTile(event.x, event.y, this.map);
        switch(this.state) {
            case this.states.MOVE_CONFIRM:
                return;
            case this.states.ATTACK_REQUEST:
                if (BeastLogic.isValidSelection(location, this.range)) {
                    this.selection = this.active.actions.basic.getTarget(location, this.units, this.map, this.range);
                } else {
                    this.selection = null;
                    location = null;
                }
                break;
            case this.states.WAIT_REQUEST:
                this.orientation = Game.actions.changeOrientation(this.active, event.x, event.y) || this.active.orientation;
                break;
            default:
                break;
        }

        this._updateFocus(location);
    }

    onMouseWheel(event) {
        console.log(event);
    }

    onClick(event) {
        const location = Game.camera._windowToTile(event.x, event.y, this.map);
        switch(this.state) {
            case this.states.NONE:
                break;
            case this.states.MOVE_REQUEST:
                this.confirmMove(location);
                break;
            case this.states.ATTACK_REQUEST:
                this.confirmAttack(location);
                break;
            case this.states.WAIT_REQUEST:
                this.confirmWait(this.active);
                break;
        }
    }

    onRightClick(event) {
        switch(this.state) {
            case this.states.MOVE_REQUEST:
                this.cancelMove();
                break;
            case this.states.ATTACK_REQUEST:
                this.cancelAttack();
                break;
            case this.states.PLAYER_TURN:
                this.resetMove();
                break;
            case this.states.WAIT_REQUEST:
                this.cancelWait();
                break;
        }
    }

    // -------------------
    // KEYBOARD/GAMEPAD BINDINGS INPUT MEDIATION
    // --------------------------

    onKeyUp(event) {
        // TODO
    }
}