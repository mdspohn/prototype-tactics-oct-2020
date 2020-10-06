class CombatController {
    constructor(views, actions, ui = new CombatInterface()) {

        this.views = views;
        this.actions = actions;
        this.interface = ui;

        // -------------------
        // States
        // -----------------------

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
        // Scene
        // -----------------------

        this.scene = new Object();
        this.scene.state = this.states.NONE;
        this.scene.map = null;
        this.scene.decorations = null;
        this.scene.beasts = null;
        this.scene.active = null;
        this.scene.effects = new Effects();
        this.scene.markers = new Markers();

        // -------------------
        // Event Listeners
        // -----------------------

        Events.listen('MOVE_REQUEST',   (event) => this.requestMove(event),   true);
        Events.listen('ATTACK_REQUEST', (event) => this.requestAttack(event), true);
        Events.listen('SKILLS_MENU',    (event) => this.requestSkill(event),  true);
        Events.listen('WAIT_REQUEST',   (event) => this.requestWait(event),   true);
    }

    get map()         { return this.scene.map;         }
    get decorations() { return this.scene.decorations; }
    get beasts()      { return this.scene.beasts;      }
    get effects()     { return this.scene.effects;     }
    get markers()     { return this.scene.markers;     }
    get active()      { return this.scene.active;      }
    get state()       { return this.scene.state;       }

    set active(beast) { this.scene.active = beast;     }
    set state(state)  { this.scene.state  = state;     }

    // -------------------
    // Asset Prep and Loading
    // --------------------------

    async load() {
        await Promise.all([this.markers.load(), this.interface.load()]);
    }

    async prepare(map, decorations, beasts) {
        this.scene.map = map;
        this.scene.decorations = decorations;
        this.scene.beasts = beasts;
        this.beasts.forEach(beast => {
            const location = this.map.getLocation(beast.location.x, beast.location.y);
            beast.initialize(location);
            this.map.addPointOfInterest(location);
        });
    }

    async initialize() {
        Game.camera.toCenter(Game.canvas, this.map);
        this.nextTurn();
        
        // setTimeout(() => {
        // Game.actions.move(this.active, BeastLogic.getPath(this.map.getLocation(5,8), BeastLogic.getRange(this.active, this.beasts, this.map))).then((data) => {
        // });
        // }, 2000)
    }

    // -------------------
    // Update and Rendering
    // --------------------------
    
    update(step) {
        this.views.updateMap(this.map, step);
        this.views.updateBeasts(this.beasts, step);
        this.views.updateEffects(this.effects, step);
        this.views.updateMarkers(this.markers, step);

        this.interface.update(step);
    }

    render(delta) {
        this.views.updateMap(this.map, delta, true);
        this.views.updateBeasts(this.beasts, delta, true);
        this.views.updateEffects(this.effects, delta, true);
        this.views.updateMarkers(this.markers, delta, true);

        this.map.getSorted(this.views.settings.sorting).forEach(location => {
            this.views.renderTiles(this.map, location);
            this.views.renderMarkers(this.markers, location);
            this.views.renderDecorations(this.map, location);
            this.views.renderBackgroundEffects(this.effects, location);
            this.views.renderBeasts(this.beasts, location);
            this.views.renderForegroundEffects(this.effects, location);
        });
        this.views.renderIndicators(this.markers, this.active);
        this.views.renderScreenEffects(this.effects);

        this.interface.render(delta);
    }

    // -------------------
    // Turn Management
    // --------------------------

    async nextTurn() {
        // await this.actions.nextTurn(this.scene, this.interface);

        this.active = CombatLogic.getNextTurn(this.beasts);
        this.active.resetTurn();
        this.interface.updateTurns(CombatLogic.getTurns(this.beasts), this.active);

        // pan camera to entity
        Game.camera.toLocation(this.active.location, 750, 'ease-out');

        // enable interface and new state
        await this.interface.nextTurn(this.active);
        this.state = this.states.PLAYER_TURN;
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
        this.markers.range = BeastLogic.getRange(this.active, this.beasts, this.map);
        this.interface.requestMove();
    }

    confirmMove(location) {
        if (location === undefined || !BeastLogic.isValidSelection(location, this.markers.range))
            return;

        this.state = this.states.MOVE_CONFIRM;

        const stepListenerId = Events.listen('move-step', (data) => {
            this.interface._updateHeight(data.animation.destination.z);
            this.map.removePointOfInterest(data.previous);
            this.map.addPointOfInterest(data.animation.destination);
        }, true);
        Game.actions.move(this.active, BeastLogic.getPath(location, this.markers.range)).then((data) => {
            this.state = this.states.PLAYER_TURN;
            this.interface.confirmMove(this.active.getRemainingMovement());
            this.interface._updateHeight(this.active.location.z);
            this.markers.clear();
            this.map.removePointOfInterest(data.previous);
            this.map.addPointOfInterest(data.animation.destination);
            Events.remove('move-step', stepListenerId);
        });
        this.markers.range = null;
    }

    cancelMove() {
        this.state = this.states.PLAYER_TURN;
        this.markers.clear();
        this.interface.cancelMove();
    }

    resetMove() {
        if (this.active.traveled.last !== 0) {
            this.map.removePointOfInterest(this.active.location);
            Game.actions.resetMove(this.active).then(() => this.map.addPointOfInterest(this.active.location));
            this.map.addPointOfInterest(this.active.location)
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
    
        const attackRange = SkillLogic.getRange('sword', this.active, this.beasts, this.map);
        this.markers.range = attackRange;
        this.interface.requestAttack();
    }

    confirmAttack(location) {
        Game.actions.useSkill('sword', this.active, location, this.beasts, this.map, Game.camera, Game.effects, Game.sounds).then(() => {
            this.state = this.states.PLAYER_TURN;
            this.interface.cancelAttack();
        });
        this.markers.clear();
    }

    cancelAttack() {
        this.state = this.states.PLAYER_TURN;
        this.markers.clear();
        this.interface.cancelAttack();
    }

    requestSkillsMenu(entity) {
        // TODO
    }

    async requestSkill(entity) {
        if (this.state === this.states.SKILL_REQUEST)
            return this.cancelSkill();
        
        if (this.state !== this.states.PLAYER_TURN || !this.active.canAttack())
            return;

        this.state = this.states.SKILL_REQUEST;
    
        const attackRange = SkillLogic.getRange('flicker', this.active, this.beasts, this.map);
        this.markers.range = attackRange;
        this.interface.requestSkill();
    }

    confirmSkill(location) {
        Game.actions.useSkill('flicker', this.active, location, this.beasts, this.map, Game.camera, Game.effects, Game.sounds).then(() => {
            this.state = this.states.PLAYER_TURN;
        });
        this.markers.clear();
    }

    cancelSkill() {
        this.state = this.states.PLAYER_TURN;
        this.markers.clear();
        this.interface.cancelSkill();
    }

    requestWait(event) {
        if (this.state !== this.states.PLAYER_TURN)
            return;
        this.markers.orientation = this.active.orientation;
        this.state = this.states.WAIT_REQUEST;
    }

    confirmWait(event) {
        this.state = this.states.WAIT_CONFIRM;
        this.markers.clear();
        this.interface.endTurn().then(() => this.nextTurn());
    }

    cancelWait() {
        this.state = this.states.PLAYER_TURN;
        this.markers.clear();
    }

    _updateFocus(location) {
        if (this.markers.focus === location)
            return;
        

        switch(this.state) {
            case this.states.MOVE_REQUEST:
                if (BeastLogic.isValidSelection(location, this.markers.range)) {
                    this.markers.focus = location;
                    this.markers.path = BeastLogic.getPath(location, this.markers.range);
                } else {
                    this.markers.focus = null;
                    this.markers.path = null;
                }
                break;
            case this.states.MOVE_CONFIRM:
                break;
            case this.states.ATTACK_REQUEST:
                if (BeastLogic.isInRange(location, this.markers.range)) {
                    this.markers.focus = location;
                } else {
                    this.markers.focus = null;
                }
                break;
            case this.states.SKILL_REQUEST:
                if (BeastLogic.isInRange(location, this.markers.range)) {
                    this.markers.focus = location;
                } else {
                    this.markers.focus = null;
                }
                break;
            default:
                this.markers.focus = null;
        }

        this.map.changePointOfFocus(this.markers.focus);
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
                if (BeastLogic.isValidSelection(location, this.markers.range)) {
                    this.markers.selection = SkillLogic.getSelection('sword', location, this.beasts, this.map, this.markers.range);
                } else {
                    this.markers.selection = null;
                    location = null;
                }
                break;
            case this.states.SKILL_REQUEST:
                if (BeastLogic.isValidSelection(location, this.markers.range)) {
                    this.markers.path = BeastLogic.getPath(location, this.markers.range);
                    this.markers.selection = SkillLogic.getSelection('flicker', location, this.beasts, this.map, this.markers.range);
                } else {
                    this.markers.path = null;
                    this.markers.selection = null;
                    location = null;
                }
                break;
            case this.states.WAIT_REQUEST:
                Game.actions.changeOrientation(this.active, event.x, event.y).then(orientation => this.markers.orientation = orientation);
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
            case this.states.SKILL_REQUEST:
                this.confirmSkill(location);
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
            case this.states.SKILL_REQUEST:
                this.cancelSkill(location);
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