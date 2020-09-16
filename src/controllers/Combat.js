class CombatInterface {
    constructor() {
        this.animations = new Array();

        // Header Toolbar
        this.header = new Object();
        this.header.dom = new Object();
        this.header.dom.wrapper = document.getElementById('combat__header');
        this.header.dom.suggestions = document.getElementById('ch__suggestions');
        this.header.dom.settings    = document.getElementById('ch__settings');

        // Actions Menu
        this.menu = new Object();
        this.menu.dom = new Object();
        this.menu.dom.wrapper = document.getElementById('combat__menu');
        this.menu.dom.actions = document.getElementById('cm__root');
        this.menu.dom.actions_move   = document.getElementById('cma__move');
        this.menu.dom.actions_attack = document.getElementById('cma__attack');
        this.menu.dom.actions_skills = document.getElementById('cma__skills');
        this.menu.dom.actions_wait   = document.getElementById('cma__wait');
        this.menu.dom.skills = document.getElementById('cm__skills');

        // Location Information
        this.location = new Object();
        this.location.dom = new Object();
        this.location.dom.elevation = document.getElementById('cle__count');

        // Turn Order
        this.turns = new Object();
        this.turns.dom = new Object();
        this.turns.dom.wrapper = document.getElementById('combat__order');
        this.turns.dom.canvas  = document.getElementById('co__canvas');
        this.turns.ctx = this.turns.dom.canvas.getContext('2d');

        this.turns.forecast = [];
        this.turns.isAnimating = false;
        this.turns.offset = 0;

        // Battlefield Conditions
        this.conditions = new Object();
        this.conditions.dom = new Object();
        this.conditions.dom.wrapper = document.getElementById('combat__conditions');
        this.conditions.dom.weather = document.getElementById('cc__weather');
        this.conditions.dom.moon    = document.getElementById('cc__moon');

        // Active Unit
        this.active = new Object();
        this.active.dom = new Object();
        this.active.dom.wrapper = document.getElementById('combat__active');
        this.active.dom.canvas  = document.getElementById('ca__canvas');
        this.active.dom.level   = document.getElementById('cain__level');
        this.active.dom.name    = document.getElementById('cain__species');
        this.active.dom.hp_cur  = document.getElementById('caishp__current');
        this.active.dom.hp_max  = document.getElementById('caishp__max');
        this.active.dom.hp_bar  = document.getElementById('caishp__bar');
        this.active.dom.tp_cur  = document.getElementById('caistp__current');
        this.active.dom.tp_max  = document.getElementById('caistp__max');
        this.active.dom.tp_bar  = document.getElementById('caistp__bar');
        this.active.ctx = this.active.dom.canvas.getContext('2d');

        // Target Unit
        this.target = new Object();
        this.target.dom = new Object();
        this.target.dom.wrapper = document.getElementById('combat__target');
        this.target.dom.canvas  = document.getElementById('ct__canvas');
        this.target.dom.level   = document.getElementById('ctin__level');
        this.target.dom.name    = document.getElementById('ctin__species');
        this.target.dom.hp_cur  = document.getElementById('ctishp__current');
        this.target.dom.hp_max  = document.getElementById('ctishp__max');
        this.target.dom.hp_bar  = document.getElementById('ctishp__bar');
        this.target.dom.tp_cur  = document.getElementById('ctistp__current');
        this.target.dom.tp_max  = document.getElementById('ctistp__max');
        this.target.dom.tp_bar  = document.getElementById('ctistp__bar');
        this.target.ctx = this.target.dom.canvas.getContext('2d');

        // Click Event Listeners
        this.menu.dom.actions_move.addEventListener('click', () => Events.dispatch('MOVE_REQUEST'));
        this.menu.dom.actions_attack.addEventListener('click', () => Events.dispatch('ATTACK_REQUEST'));
        this.menu.dom.actions_skills.addEventListener('click', () => Events.dispatch('SKILLS_MENU'));
        this.menu.dom.actions_wait.addEventListener('click', () => Events.dispatch('WAIT_REQUEST'));
    }

    async _load() {
        const loader = (resolve) => {
            this.img = new Image();
            this.img.onload = resolve;
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}miscellaneous${OS_FILE_SEPARATOR}combat-ui-tiles.png`;
        };
        await new Promise(loader);
    }

    update(step) {
        this.animations.forEach((animation) => {
            const differenceRemaining = animation.target - animation.current,
                  percentChange = Math.min(step / animation.ms, 1);
            
            animation.current += differenceRemaining * percentChange;
            animation.ms = Math.max(animation.ms - step, 0);
        });

        if (!this.turns.isAnimating)
            return;
        
        this.turns.offset = Math.floor(Math.max(this.turns.offset - ((step / 500) * 32), 0));
    }

    render(delta) {
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const msRemaining = this.animations[i].ms - delta,
                  element     = this.animations[i].element,
                  type        = this.animations[i].style,
                  event       = this.animations[i].event;

            if (msRemaining <= 0) {
                element.style[type] = this.animations[i].target + this.animations[i].suffix;
                this.animations.splice(i, 1);
                if (event !== null)
                    Events.dispatch(event);
            } else {
                const value = this.animations[i].current + (this.animations[i].target - this.animations[i].current) * Math.min(delta / this.animations[i].ms, 1);
                element.style[type] = value + this.animations[i].suffix;
            }
        }

        if (!this.turns.isAnimating)
            return;
        
        const offset = Math.floor(Math.max(this.turns.offset - ((delta / 500) * 32), 0));

        this.turns.isAnimating = (offset !== 0);
        this.turns.forecast.forEach((entity, index) => {
            const x       = (index *  32),
                  clear   = (index === 0),
                  opacity = (index === 0) ? (Math.max(offset - 16, 0) / 16) : (index === this.turns.forecast.length - 1) ? 1 - (offset / 32) : 1;
                  
            this._renderEntity(this.turns.dom.canvas, this.turns.ctx, entity, false, clear, x + offset, true, opacity);
        });
    }

    _renderEntity(canvas, ctx, entity, showTile = true, clearCanvas = true, x = 0, mirrored = false, opacity = 1) {
        if (clearCanvas === true)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (showTile === true)
            this.active.ctx.drawImage(this.img, 0, 0, 32, 48, 0, canvas.height - 48, 32, 48);
        
        ctx.save();
        if (opacity !== 1)
            ctx.globalAlpha = opacity;
        
        Game.views.getBeastRenderer().renderToCanvas(ctx, entity, 0, mirrored, x, (canvas.height - entity.tileset.th) - (~~showTile * 8), 1);
        ctx.restore();
    }

    _setElement(element, style, value, suffix = '') {
        element.style[style] = value + suffix;
    }

    _animateElement(element, style, target, ms = 500, suffix = '', event = null) {
        let current = element.style[style];
        if (current === '')
            current = window.getComputedStyle(element)[style];
        current = ~~current.replace(suffix, '');

        this.animations.push({ element, style, current, target, ms, suffix, event });
    }

    _updateUnit(element, entity) {
        const HP_PAD = '000'.substr(0, (Math.max(3 - String(entity.health).length, 0))),
              TP_PAD = '000'.substr(0, (Math.max(3 - String(entity.tp).length, 0)));
        
        element.dom.name.innerText = entity.name;
        element.dom.level.innerText = ('0' + entity.level).slice(-2);
        element.dom.hp_cur.innerHTML = `<span class="dim">${HP_PAD}</span>${entity.health}`;
        element.dom.tp_cur.innerHTML = `<span class="dim">${TP_PAD}</span>${entity.tp}`;
        element.dom.hp_max.innerText = ('00' + entity.health).slice(-3);
        element.dom.tp_max.innerText = '300';
        element.dom.hp_bar.style.width = Math.ceil((entity.health / entity.health) * 100) + '%';
        element.dom.tp_bar.style.width = Math.ceil((entity.tp / 300) * 100) + '%';
    }

    updateTurns(forecast, active) {
        this.turns.forecast = forecast;
        this.turns.isAnimating = true;
        if (active !== undefined && (active != forecast[0])) {
            this.turns.offset = 32;
            this.turns.forecast.unshift(active);
        }
    }

    _updateSuggestion(text, icon = 'info') {
        this.header.dom.suggestions.class = icon;
        this.header.dom.suggestions.innerText = text;
    }

    _updateHeight(height) {
        this.location.dom.elevation.innerText = ~~height;
    }

    async nextTurn(entity) {
        this._updateUnit(this.active, entity);
        this._updateHeight(entity.location.getZ());
        this._setElement(this.active.dom.wrapper, 'left', 10, 'px');
        this._animateElement(this.active.dom.wrapper, 'left',   30, 500, 'px', 'active-show');
        this._animateElement(this.active.dom.wrapper, 'opacity', 1, 500);
        this._renderEntity(this.active.dom.canvas, this.active.ctx, entity);
        this.menu.dom.actions_move.classList.toggle('dim', false);
        
        return new Promise((resolve) => Events.listen('active-show', resolve));
    }

    async endTurn() {
        this._animateElement(this.active.dom.wrapper, 'left',  50, 500, 'px', 'active-hide');
        this._animateElement(this.active.dom.wrapper, 'opacity', 0, 500);

        return new Promise((resolve) => Events.listen('active-hide', resolve));
    }

    async requestMove() {
        this._animateElement(this.active.dom.wrapper, 'left',  50, 500, 'px', 'active-hide');
        this._animateElement(this.active.dom.wrapper, 'opacity', 0, 500);
        this._updateSuggestion('Click on a tile to move. Right-click to cancel.');
    }

    async cancelMove() {
        this._animateElement(this.active.dom.wrapper, 'left',   30, 500, 'px', 'active-show');
        this._animateElement(this.active.dom.wrapper, 'opacity', 1, 500);
        this._updateSuggestion('Select an action. The mouse wheel can be used to navigate menus.');
        this.menu.dom.actions_move.classList.toggle('dim', false);
    }

    async confirmMove(stepsRemaining) {
        this._animateElement(this.active.dom.wrapper, 'left',   30, 500, 'px', 'active-show');
        this._animateElement(this.active.dom.wrapper, 'opacity', 1, 500);
        if (stepsRemaining <= 0) {
            this.menu.dom.actions_move.classList.toggle('dim', true);
        }
        this._updateSuggestion('Select an action. The mouse wheel can be used to navigate menus.');
    }

    async resetMove() {
        this.menu.dom.actions_move.classList.toggle('dim', false);
    }

    async requestAttack() {
        this._updateSuggestion('Select a tile to attack. Right-click to cancel.');
    }

    async confirmAttack() {
        this.menu.dom.actions_attack.classList.toggle('dim', true);
        this._updateSuggestion('Select an action. The mouse wheel can be used to navigate menus.');
    }

    async cancelAttack() {
        this._updateSuggestion('Select an action. The mouse wheel can be used to navigate menus.');
        this.menu.dom.actions_attack.classList.toggle('dim', false);
    }

    async requestWait() {

    }

    async cancelWait() {

    }

    async confirmWait() {

    }
}

class CombatController {
    constructor() {
        // ----------------
        // SCENE
        // --------------------

        this.map = null;
        this.decoration = null;
        this.entities = null;

        this.active = null; // <Beast>

        // -------------------
        // COMBAT STATE
        // -----------------------

        this.markers   = new Markers();
        this.interface = new CombatInterface();

        //this.skills = new SkillManager();

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

        this.state = 0; // <0-29>

        // -------------------
        // EVENT LISTENERS
        // -----------------------

        Events.listen('MOVE_REQUEST',   (event) => this.requestMove(event),   true);
        Events.listen('ATTACK_REQUEST', (event) => this.requestAttack(event), true);
        Events.listen('SKILLS_MENU',    (event) => this.skillsMenu(event),    true);
        Events.listen('WAIT_REQUEST',   (event) => this.requestWait(event),   true);
    }

    async _load() {
        await Promise.all([this.markers._load(), this.interface._load()]);
    }

    async _prepare(map, decoration, entities) {
        this.map = map;
        this.decoration = decoration;
        this.entities = entities;
        this.entities.forEach(unit => {
            unit.initialize(this.map.getLocation(unit.initialX, unit.initialY))
        });
    }

    async _initialize() {
        Game.camera.toCenter(Game.canvas, this.map);
        this.nextTurn();
    }

    // -------------------
    // COMBAT STATE CHANGES
    // --------------------------

    async nextTurn() {
        // this.active = Game.actions.getNextTurn(this.entities);
        // this.active.resetTurn();

        // const forecast = Game.actions.getTurnForecast(this.entities);
        // this.interface.updateTurnForecast(forecast, this.active);

        // Game.camera.toLocation(this.active.location, 750, 'ease-out');

        // this.state = this.states.PLAYER_TURN;
        // await this.interface.nextTurn(this.active);

        // set new active entity
        this.active = TurnLogic.getNext(this.entities);
        this.active.resetTurn();
        this.interface.updateTurns(TurnLogic.getForecast(this.entities), this.active);

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
        Game.views.updateMarkers(step, this.markers);
        Game.views.updateDecorations(step, this.decoration);
        Game.views.updateBeasts(step, this.entities);
        Game.views.updateSkills(step, this.skills);
        Game.views.updateInterface(step, this.interface);
    }

    render(delta) {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        const locations = this.map.getLocations();

        let restart = false;
        for (let i = 0; i < locations.length; i++) {
            Game.views.renderMap(delta, Game.ctx, Game.camera, locations[i], this.map);
            Game.views.renderMarkers(delta, Game.ctx, Game.camera, locations[i], this.markers);
            Game.views.renderDecorations(delta, Game.ctx, Game.camera, locations[i], this.decoration);
            restart |= Game.views.renderBeasts(delta, Game.ctx, Game.camera, locations[i], this.entities);
            restart |= Game.views.renderSkills(delta, Game.ctx, Game.camera, locations[i], this.skills);
            if (restart)
                break;
        }

        if (restart)
            return this.render(delta);

        Game.views.renderInterface(delta, this.interface);
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

        if (event !== undefined)
            event.stopPropagation();

        this.markers.setRange(MovementLogic.getMovementRange(this.active, this.entities, this.map));
        this.interface.requestMove();
    }

    confirmMove(location) {
        if (location === undefined || !MovementLogic.isValidSelection(location, this.markers.range))
            return;

        this.state = this.states.MOVE_CONFIRM;

        const stepListenerId = Events.listen('move-step', (beast) => {
            this.interface._updateHeight(beast.animation.destination.getZ());
        }, true);
        this.markers.setRange(null);
        Game.actions.move(this.active, this.markers.getPath()).then(() => {
            this.active.hasMoved = true;
            this.state = this.states.PLAYER_TURN;
            this.interface.confirmMove(this.active.getMovement());
            this.interface._updateHeight(this.active.location.getZ());
            this.markers.setFocus(null);
            this.markers.setPath(null);
            Events.remove('move-step', stepListenerId);
        });
    }

    cancelMove() {
        this.state = this.states.PLAYER_TURN;
        this.markers.setRange(null);
        this.markers.setPath(null);
        this.interface.cancelMove();
    }

    resetMove() {
        if (this.active.lastMoved !== 0) {
            this.active.resetMove();
            this.interface.resetMove();
            this.requestMove();
        }
    }

    requestAttack(event) {
        if (this.state === this.states.ATTACK_REQUEST)
            return this.cancelAttack();
        
        if (this.state !== this.states.PLAYER_TURN || !this.active.canAttack())
            return;

        this.state = this.states.ATTACK_REQUEST;

        if (event !== undefined)
            event.stopPropagation();

    
        const attackRange = this.active.actions.basic.getRange(this.active, this.entities, this.map);
        this.markers.setRange(attackRange);

        // const atkData = this.active.getAttackData(),
        //       atkRange = this.pathing.getSkillRange(this.active.location, this.map, Object.assign(atkData.range, { markerType: 'white' }));

        // this.markers.setRange(atkRange);
        this.interface.requestAttack();
    }

    confirmAttack(location) {

    }

    cancelAttack() {
        this.state = this.states.PLAYER_TURN;
        this.markers.setRange(null);
        this.markers.setSelection(null);
        this.interface.cancelAttack();
    }

    requestSkillsMenu(entity) {}

    requestSkill(entity) {}

    confirmSkill(entity) {}

    requestWait(entity) {
        if (this.state !== this.states.PLAYER_TURN)
            return;
        this.state = this.states.WAIT_REQUEST;
        this.interface.endTurn().then(() => {
            this.confirmWait(entity);
        });
    }

    confirmWait(entity) {
        this.state = this.states.WAIT_CONFIRM;
        this.nextTurn();
    }

    _updateFocus(location) {
        if (this.markers.getFocus() === location)
            return;
        
        switch(this.state) {
            case this.states.MOVE_REQUEST:
                if (this.markers.getRange().has(location) && this.markers.getRange().get(location).isSelectable) {
                    this.markers.setFocus(location);
                    this.markers.setPath(MovementLogic.getPathing(location, this.markers.getRange()));
                } else {
                    this.markers.setFocus(null);
                    this.markers.setPath(null);
                }
                break;
            case this.states.MOVE_CONFIRM:
                break;
            case this.states.ATTACK_REQUEST:
                if (this.markers.getRange().has(location)) {
                    this.markers.setFocus(location);
                } else {
                    this.markers.setFocus(null);
                }
                break;
            default:
                this.markers.setFocus(null);
        }
    }

    // this.states.NONE           = 0;
    // this.states.AI_TURN        = 10;
    // this.states.PLAYER_TURN    = 20;
    // this.states.MOVE_REQUEST   = 21;
    // this.states.MOVE_CONFIRM   = 22;
    // this.states.ATTACK_REQUEST = 23;
    // this.states.ATTACK_CONFIRM = 24;
    // this.states.SKILLS         = 25;
    // this.states.SKILL_REQUEST  = 26;
    // this.states.SKILL_CONFIRM  = 27;
    // this.states.WAIT_REQUEST   = 28;
    // this.states.WAIT_CONFIRM   = 29;

    // -------------------
    // MOUSE INPUT MEDIATION
    // --------------------------

    onMouseMove(event) {
        let location = Game.camera._windowToTile(event.x, event.y, this.map);
        switch(this.state) {
            case this.states.MOVE_CONFIRM:
                return;
            case this.states.ATTACK_REQUEST:
                if (this.markers.getRange().has(location) && this.markers.getRange().get(location).isSelectable) {
                    this.markers.setSelection(this.active.actions.basic.getTarget(location, this.entities, this.map, this.markers.getRange()));
                } else {
                    this.markers.setSelection(null);
                    location = null;
                }
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
        }
    }

    // -------------------
    // KEYBOARD/GAMEPAD BINDINGS INPUT MEDIATION
    // --------------------------

    onKeyUp(event) {
        // TODO
    }
}