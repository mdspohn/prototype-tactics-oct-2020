class CombatController {
    constructor(views, actions, ui = new CombatInterface()) {

        this.views = views;
        this.actions = actions;
        this.interface = ui;

        // -------------------
        // Scene / State
        // -----------------------

        this.map = null;
        this.decorations = null;
        this.beasts = null;

        this.active = null;
        this.effects = new Effects();
        this.markers = new Markers();

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

        this.state = this.states.NONE;

        // -------------------
        // EVENT LISTENERS
        // -----------------------

        Events.listen('MOVE_REQUEST',   (event) => this.requestMove(event),   true);
        Events.listen('ATTACK_REQUEST', (event) => this.requestAttack(event), true);
        Events.listen('SKILLS_MENU',    (event) => this.requestSkill(event),  true);
        Events.listen('WAIT_REQUEST',   (event) => this.requestWait(event),   true);
    }

    // -------------------
    // Asset Prep and Loading
    // --------------------------

    async load() {
        await Promise.all([this.markers.load(), this.interface.load()]);
    }

    async prepare(map, decorations, beasts) {
        this.map = map;
        this.decorations = decorations;
        this.beasts = beasts;
        this.beasts.forEach(beast => {
            const location = this.map.getLocation(beast.location.x, beast.location.y);
            beast.initialize(location);
        });
    }

    async initialize() {
        Game.camera.toCenter(Game.canvas, this.map);
        this.nextTurn();
    }

    // -------------------
    // Update and Rendering
    // --------------------------
    
    update(step) {
        this.views.updateMap(this.map, step);
        this.views.updateDecorations(this.decorations, step);
        this.views.updateBeasts(this.beasts, step);
        this.views.updateEffects(this.effects, step);
        this.views.updateMarkers(this.markers, step);

        this.interface.update(step);
    }

    render(delta) {
        this.views.updateMap(this.map, delta, true);
        this.views.updateDecorations(this.decorations, delta, true);
        this.views.updateBeasts(this.beasts, delta, true);
        this.views.updateEffects(this.effects, delta, true);
        this.views.updateMarkers(this.markers, delta, true);

        this.map.getLocations(this.views.settings.sorting).forEach(location => {
            this.views.renderMap(this.map, location);
            this.views.renderMarkers(this.markers, location);
            this.views.renderDecorations(this.decorations, location);
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

        const stepListenerId = Events.listen('move-step', (animation) => {
            this.interface._updateHeight(animation.destination.getZ());
        }, true);
        Game.actions.move(this.active, BeastLogic.getPath(location, this.markers.range)).then(() => {
            this.active.hasMoved = true;
            this.state = this.states.PLAYER_TURN;
            this.interface.confirmMove(this.active.getRemainingMovement());
            this.interface._updateHeight(this.active.location.getZ());

            this.markers.focus = null;
            this.markers.path = null;

            Events.remove('move-step', stepListenerId);
        });
        this.markers.range = null;
    }

    cancelMove() {
        this.state = this.states.PLAYER_TURN;
        this.markers.range = null;
        this.markers.path = null;
        this.interface.cancelMove();
    }

    resetMove() {
        if (this.active.traveled.last !== 0) {
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
    
        const attackRange = SkillLogic.getRange('sword', this.active, this.beasts, this.map);
        this.markers.range = attackRange;
        this.interface.requestAttack();
    }

    confirmAttack(location) {
        Game.actions.useSkill('sword', this.active, location, this.beasts, this.map, Game.camera, Game.effects, Game.sounds).then(() => {
            this.state = this.states.PLAYER_TURN;
            this.interface.cancelAttack();
        });
        this.markers.range = null;
        this.markers.selection = null;
        this.markers.focus = null;
    }

    cancelAttack() {
        this.state = this.states.PLAYER_TURN;
        this.markers.range = null;
        this.markers.selection = null;
        this.markers.focus = null;
        this.interface.cancelAttack();
    }

    requestSkillsMenu(entity) {}

    async requestSkill(entity) {
        // await Game.actions.useSkill('flicker', this.active, this.map.getLocation(4, 6), this.units, this.map, Game.camera, Game.effects, Game.sounds);
        // await Game.actions.move(this.active, BeastLogic.getPath(this.map.getLocation(4, 6), BeastLogic.getRange(this.active, this.units, this.map)));
        // await Game.actions.useSkill('sword', this.active, this.map.getLocation(4, 7), this.units, this.map, Game.camera, Game.effects, Game.sounds);
        // await Game.actions.move(this.active, BeastLogic.getPath(this.map.getLocation(4, 7), BeastLogic.getRange(this.active, this.units, this.map)));
        // await Game.actions.useSkill('sword', this.active, this.map.getLocation(4, 8), this.units, this.map, Game.camera, Game.effects, Game.sounds);
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
        console.log('starting skill');
        Game.actions.useSkill('flicker', this.active, location, this.beasts, this.map, Game.camera, Game.effects, Game.sounds).then(() => {
            console.log('skill done');
            this.state = this.states.PLAYER_TURN;
        });
        this.markers.range = null;
        this.markers.path = null;
        this.markers.focus = null;
        this.markers.selection = null;
    }

    cancelSkill() {
        this.state = this.states.PLAYER_TURN;
        this.markers.range = null;
        this.markers.selection = null;
        this.markers.focus = null;
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
        this.markers.orientation = null;
        this.interface.endTurn().then(() => this.nextTurn());
    }

    cancelWait() {
        this.state = this.states.PLAYER_TURN;
        this.markers.orientation = null;
    }

    _updateFocus(location) {
        if (this.focus === location)
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
                    Game.actions.changeOrientation(this.active, event.x, event.y);
                } else {
                    this.markers.selection = null;
                    location = null;
                }
                break;
            case this.states.SKILL_REQUEST:
                if (BeastLogic.isValidSelection(location, this.markers.range)) {
                    this.markers.path = BeastLogic.getPath(location, this.markers.range);
                    this.markers.selection = SkillLogic.getSelection('flicker', location, this.beasts, this.map, this.markers.range);
                    Game.actions.changeOrientation(this.active, event.x, event.y);
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