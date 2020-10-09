class CombatController {
    constructor(views, actions) {

        this.views = views;
        this.actions = actions;

        // -------------------
        // States
        // -----------------------

        this.states = new Object();
        this.states["CINEMATIC"]      = 0;
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
        this.scene.state = this.states.CINEMATIC;
        this.scene.active = null;
        this.scene.ui = new CombatUI();
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

    load() {
        const pending = new Array();
        pending.push(this.scene.markers.load());
        pending.push(this.scene.ui.load());
        return Promise.all(pending);
    }

    prepare(scene) {
        scene.beasts.forEach(beast => {
            const location = scene.map.getLocation(beast.location.x, beast.location.y);
            beast.initialize(location);
            scene.map.addPointOfInterest(location);
        });
        Object.assign(this.scene, scene);
    }

    initialize() {
        // TODO: cinematic sequence, then start combat
        this.scene.camera.toCenter(Game.canvas, this.scene.map);
        this.nextTurn();
    }

    // -------------------
    // Update and Rendering
    // --------------------------
    
    update(step) {
        this.views.updateMap(this.map, step);
        this.views.updateBeasts(this.beasts, step);
        this.views.updateEffects(this.effects, step);
        this.views.updateMarkers(this.markers, step);

        this.scene.ui.update(step);
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

        this.scene.ui.render(delta);
    }

    // -------------------
    // Turn Management
    // --------------------------

    async nextTurn() {
        this.state = await this.actions.nextTurn(this.scene, this.states);
        if (this.state === this.states.AI_TURN) {
            // TODO: begin AI turn sequence
        }
    }

    // -------------------
    // Player Actions
    // -------------------------

    async requestMove() {
        if (this.state === this.states.MOVE_REQUEST) {
            return this.cancelRequestMove();
        } else if (this.state === this.states.PLAYER_TURN && this.active.canMove()) {
            this.state = await this.actions.requestMove(this.scene, this.states);
        }
    }

    async cancelRequestMove() {
        this.state = await this.actions.cancelRequestMove(this.scene, this.states);
    }

    async resetMove() {
        if (this.active.traveled.last === 0 || this.active.animations.checkpoint === null)
            return;

        this.state = await this.actions.resetMove(this.scene, this.states);
    }

    async confirmMove(location = null) {
        if (location === null || !BeastLogic.isValidSelection(location, this.markers.range))
            return;

        if (this.state !== this.states.MOVE_REQUEST)
            return;

        this.state = await this.actions.confirmMove(this.scene, this.states, location);
    }

    async requestAttack() {
        if (this.state === this.states.ATTACK_REQUEST) {
            return this.cancelRequestAttack();
        } else if (this.state === this.states.PLAYER_TURN && this.active.canAttack()) {
            this.state = await this.actions.requestAttack(this.scene, this.states, 'anime');
        }
    }

    async cancelRequestAttack() {
        this.state = await this.actions.cancelRequestAttack(this.scene, this.states);
    }

    async confirmAttack(location = null) {
        if (location === null)
            return;

        if (this.state !== this.states.ATTACK_REQUEST)
            return;

        this.state = await this.actions.confirmAttack(this.scene, this.states, 'anime', location);
    }

    async requestWait() {
        if (this.state !== this.states.PLAYER_TURN)
            return;

        this.state = await this.actions.requestWait(this.scene, this.states);
    }

    async cancelRequestWait() {
        this.state = await this.actions.cancelRequestWait(this.scene, this.states);
    }

    async confirmWait() {
        if (this.state !== this.states.WAIT_REQUEST)
            return;

        this.state = await this.actions.confirmWait(this.scene, this.states);
    }

    // -------------------
    // Player Skills
    // -------------------------

    requestSkillsMenu(entity) {
        // TODO
    }

    requestSkill(entity) {
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

    cancelRequestSkill() {
        this.state = this.states.PLAYER_TURN;
        this.markers.clear();
        this.interface.cancelSkill();
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
                    this.markers.selection = SkillLogic.getSelection(this.actions.managers.skills.get('anime'), location, this.beasts, this.map, this.markers.range);
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
                this.cancelRequestMove();
                break;
            case this.states.ATTACK_REQUEST:
                this.cancelRequestAttack();
                break;
            case this.states.SKILL_REQUEST:
                this.cancelRequestSkill(location);
                break;
            case this.states.PLAYER_TURN:
                this.resetMove();
                break;
            case this.states.WAIT_REQUEST:
                this.cancelRequestWait();
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