class CombatController {
    constructor() {
        // -------------------
        // Scene
        // -----------------------

        this.map = null;
        this.decoration = null;
        this.units = null;
        this.effects = null;

        this.active = null;

        this.interface = new CombatInterface();

        // -------------------
        // Combat State
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

        this.state = this.states.NONE;
        
        // -------------------
        // Tile Markers / Indicators
        // -----------------------

        this.indicators = {
            EMPTY_WEAKMAP: new WeakMap(),
            EMPTY_ARRAY: new Array(),
            range: null,
            selection: null,
            path: null,
            focus: null,
            orientation: null,
            configurations: {
                white:  { ms: 0, duration: 4000, opacity: 0.2, index: 0 },
                yellow: { ms: 0, duration: 4000, opacity: 1,   index: 1 },
                red:    { ms: 0, duration: 4000, opactiy: 1,   index: 2 },
                focus:  { ms: 0, duration: 750,                index: 3 },
                orientation: {
                    [CombatLogic.ORIENTATIONS.NORTH]: [0, 0],
                    [CombatLogic.ORIENTATIONS.SOUTH]: [1, 1],
                    [CombatLogic.ORIENTATIONS.EAST]:  [0, 1],
                    [CombatLogic.ORIENTATIONS.WEST]:  [1, 0]
                }
            }
        };

        // -------------------
        // EVENT LISTENERS
        // -----------------------

        Events.listen('MOVE_REQUEST',   (event) => this.requestMove(event),   true);
        Events.listen('ATTACK_REQUEST', (event) => this.requestAttack(event), true);
        Events.listen('SKILLS_MENU',    (event) => this.skillsMenu(event),    true);
        Events.listen('WAIT_REQUEST',   (event) => this.requestWait(event),   true);
    }

    // -------------------
    // Map Indicators / Current Targets
    // --------------------------

    get range()       { return this.indicators.range     || this.indicators.EMPTY_WEAKMAP; }
    get selection()   { return this.indicators.selection || this.indicators.EMPTY_WEAKMAP; }
    get path()        { return this.indicators.path      || this.indicators.EMPTY_ARRAY;   }
    get focus()       { return this.indicators.focus;                                      }
    get orientation() { return this.indicators.orientation;                                }

    set range(range)             { this.indicators.range       = range;       }
    set selection(selection)     { this.indicators.selection   = selection;   }
    set path(path)               { this.indicators.path        = path;        }
    set focus(location)          { this.indicators.focus       = location;    }
    set orientation(orientation) { this.indicators.orientation = orientation; }

    // -------------------
    // Asset Prep and Loading
    // --------------------------

    async _load() {
        const markers = resolve => {
            this.indicators.img = new Image();
            this.indicators.img.onload = resolve;
            this.indicators.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}miscellaneous${OS_FILE_SEPARATOR}tile-markers.png`;
        };
        await Promise.all([new Promise(markers), this.interface._load()]);
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
    // Update and Rendering
    // --------------------------
    
    update(step) {
        this.updateMap(step);
        this.updateDecorations(step);
        this.updateBeasts(step);
        this.updateEffects(step);
        this.updateTileIndicators(step);
        this.updateInterface(step);
    }

    render(delta) {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

        const locations = this.map.getLocations();
        for (let i = 0; i < locations.length; i++) {
            let complete = true;
            complete &= this.renderLocation(delta, Game.ctx, Game.camera, locations[i]);
            complete &= this.renderTileIndicators(delta, Game.ctx, Game.camera, locations[i]);
            complete &= this.renderDecorations(delta, Game.ctx, Game.camera, locations[i]);
            complete &= this.renderBeasts(delta, Game.ctx, Game.camera, locations[i]);
            complete &= this.renderEffects(delta, Game.ctx, Game.camera, locations[i]);

            if (!complete) {
                this.render(delta);
                break;
            }
        }
        
        this.renderOrientationIndicator(delta, Game.ctx, Game.camera);
        this.renderInterface(delta);
    }

    updateMap(step) {
        Game.views.updateMap(step, this.map);
    }

    updateDecorations(step) {
        Game.views.updateDecorations(step, this.decoration);
    }

    updateBeasts(step) {
        Game.views.updateBeasts(step, this.units);
    }

    updateEffects(step) {
        Game.views.updateEffects(step, this.effects);
    }

    updateTileIndicators(step) {
        Object.values(this.indicators.configurations).forEach(config => config.ms = (config.ms + step) % config.duration);
    }

    updateInterface(step) {
        this.interface.update(step);
    }

    renderLocation(delta, ctx, camera, location) {
        return Game.views.renderLocation(delta, ctx, camera, location, this.map);
    }

    renderTileIndicators(delta, ctx, camera, location) {
        const range = this.range.get(location),
              path = this.path.includes(location),
              selection = this.selection.get(location),
              isFocus = this.focus === location;
        
        if (range === undefined && selection === undefined && !isFocus)
            return true;

        const isMirrored = location.isSloped() && [CombatLogic.ORIENTATIONS.WEST, CombatLogic.ORIENTATIONS.EAST].includes(location.getOrientation()),
              translateX = camera.getPosX() + (location.getPosX() * Game.scaling) + (~~isMirrored * 32 * Game.scaling),
              translateY = camera.getPosY() + (location.getPosY() * Game.scaling),
              xIndex = (!location.isSloped()) ? 0 : [CombatLogic.ORIENTATIONS.WEST, CombatLogic.ORIENTATIONS.NORTH].includes(location.getOrientation()) ? 1 : 2,
              color = (selection !== undefined && selection.isSelectable) ? selection.color : (range !== undefined && range.isSelectable) ? range.color : null;

        ctx.save();
        ctx.translate(translateX, translateY);

        if (isMirrored)
            ctx.scale(-1, 1);
        
        if (color !== null) {
            const config = this.indicators.configurations[color],
                  ms = (config.ms + delta) % config.duration;
            
            ctx.globalAlpha = config.opacity + Math.floor(Math.abs(ms - (config.duration / 2))) / (config.duration * 2) + (~~path * 0.4);
            ctx.drawImage(this.indicators.img, xIndex * 32, config.index * 32, 32, 24, 0, 0, (32 * Game.scaling), (24 * Game.scaling));
            ctx.globalAlpha = 1;
        }

        if (isFocus) {
            const config = this.indicators.focus,
                  ms = (config.ms + delta) % config.duration,
                  index = Math.floor((ms % (config.duration * .75)) / (config.duration * .25)),
                  overflow = ~~!index * Math.floor(ms / (config.duration * .5));
            ctx.drawImage(this.indicators.img, (index + overflow) * 32, (xIndex * 32) + 96, 32, 24, 0, 0, (32 * Game.scaling), (24 * Game.scaling));
        }

        ctx.restore();
        return true;
    }

    renderDecorations(delta, ctx, camera, location) {
        return Game.views.renderDecorations(delta, ctx, camera, location, this.decoration);
    }

    renderBeasts(delta, ctx, camera, location) {
        return Game.views.renderBeasts(delta, ctx, camera, location, this.units);
    }

    renderEffects(delta, ctx, camera, location) {
        return Game.views.renderEffects(delta, ctx, camera, location, this.effects);
    }

    renderOrientationIndicator(delta, ctx, camera) {
        if (this.orientation === null)
            return;

        const translateX = camera.getPosX() + ((this.active.location.getPosX()) * Game.scaling),
              translateY = camera.getPosY() + ((this.active.location.getPosY() - this.active.tileset.th + this.active.location.td + 3) * Game.scaling),
              xIndex = this.indicators.configurations.orientation[this.orientation][0],
              yIndex = this.indicators.configurations.orientation[this.orientation][1];

        ctx.save();
        ctx.translate(translateX, translateY);
        ctx.drawImage(this.indicators.img, xIndex * 32, (yIndex * 16) + 192, 32, 16, 0, 0, (32 * Game.scaling), (16 * Game.scaling))
        ctx.restore();
    }

    renderInterface(delta) {
        this.interface.render(delta);
    }

    // -------------------
    // Turn Management
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
            this.path = null;

            Events.remove('move-step', stepListenerId);
        });
        this.range = null;
    }

    cancelMove() {
        this.state = this.states.PLAYER_TURN;
        this.range = null;
        this.path = null;
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
        this.range = null;
        this.selection = null;
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
                    this.path = null;
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