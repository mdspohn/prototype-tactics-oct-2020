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

        this.turns.isAnimating = false;
        this.turns.offset = 0;
        this.turns.entities = [];

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
        this.turns.entities.forEach((entity, index) => {
            const x       = (index *  32),
                  clear   = (index === 0),
                  opacity = (index === 0) ? (Math.max(offset - 16, 0) / 16) : (index === this.turns.entities.length - 1) ? 1 - (offset / 32) : 1;
                  
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
        entity.renderToUICanvas(ctx, x, (canvas.height - entity.th) - (~~showTile * 8), mirrored);
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

    _updateTurns(order) {
        const active = order.old?.[0];

        this.turns.entities = order.new;
        this.turns.isAnimating = true;

        if (active === undefined)
            return;
            
        this.turns.offset = 32;
        this.turns.entities.unshift(active);
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
        this._updateHeight(entity.location.z());
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
    }

    async confirmMove() {
        this._animateElement(this.active.dom.wrapper, 'left',   30, 500, 'px', 'active-show');
        this._animateElement(this.active.dom.wrapper, 'opacity', 1, 500);
        this.menu.dom.actions_move.classList.toggle('dim', true);
        this._updateSuggestion('Select an action. The mouse wheel can be used to navigate menus.');
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
        this.layout = null;

        // -------------------
        // COMBAT STATE
        // -----------------------

        this.turns      = new TurnManager();
        this.indicators = new CombatIndicators();
        this.interface  = new CombatInterface();

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

        Events.listen('turn-order', data => this.interface._updateTurns(data), true);

        Events.listen('MOVE_REQUEST',   (event) => this.requestMove(event),   true);
        Events.listen('ATTACK_REQUEST', (event) => this.requestAttack(event), true);
        Events.listen('SKILLS_MENU',    (event) => this.skillsMenu(event),    true);
        Events.listen('WAIT_REQUEST',   (event) => this.requestWait(event),   true);
    }

    async _load() {
        await Promise.all([this.indicators._load(), this.interface._load()]);
    }

    async _prepare(map, decoration, entities, layout) {
        this.map = map;
        this.decoration = decoration;
        this.entities = entities;
        this.layout = layout;

        this.entities.forEach(unit => {
            const location = this.layout.getLocation(unit.initialX, unit.initialY);
            unit._initialize(location);
        });
        this.turns.use(this.entities);
    }

    async _initialize() {
        Game.camera.toCenter(Game.canvas, this.layout);
        this.turns.forecast();
        this.nextTurn();
    }

    // -------------------
    // COMBAT STATE CHANGES
    // --------------------------

    nextTurn() {
        this.turns.next();
        Game.camera.toLocation(this.turns.active.location, 750, 'ease-out');

        // detect if AI or player then set state
        this.state = this.states.PLAYER_TURN;

        // reset entity state for new turn
        this.turns.active.hasMoved = false;

        this.interface.nextTurn(this.turns.active);
    }

    // -------------------
    // ENGINE HOOKS
    // --------------------------
    
    update(step) {
        this.layout.forEach(location => {
            this.map.update(step, location);
            this.decoration.update(step, location);
        });
        this.entities.forEach(entity => entity.update(step));
        this.indicators.update(step);
        this.interface.update(step);
    }

    render(delta) {
        this.layout.forEach(location => {
            this.map.render(delta, location);
            this.indicators.render(delta, location);
            this.decoration.render(delta, location);
            this.entities.filter(entity => entity.location == location).forEach(occupant => occupant.render(delta, location));
        });
        this.interface.render(delta);
    }

    // -------------------
    // COMBAT ACTIONS
    // --------------------------

    requestMove(event) {
        if (this.state === this.states.MOVE_REQUEST)
            return this.cancelMove();
        
        if (this.state !== this.states.PLAYER_TURN || !this.turns.active.canMove())
            return;

        this.state = this.states.MOVE_REQUEST;

        if (event !== undefined)
            event.stopPropagation();

        this.indicators.set(this.turns.active.getRange(this.layout, this.entities), 'movement');
        this.interface.requestMove();
    }

    confirmMove(location) {
        if (location === undefined || this.indicators?.range?.[location.x]?.[location.y] === undefined)
            return;

        this.state = this.states.MOVE_CONFIRM;
        this.indicators.clear();

        const stepListenerId = Events.listen('move-step', (beast) => {
            this.interface._updateHeight(beast.location.z());
        }, true);
        Events.listen('move-complete', () => {
            this.turns.active.hasMoved = true;
            this.state = this.states.PLAYER_TURN;
            this.interface.confirmMove();
            this.interface._updateHeight(this.turns.active.location.z());
            Events.remove('move-step', stepListenerId);
        });
        this.turns.active.walkTo(location, this.layout);
    }

    cancelMove() {
        this.state = this.states.PLAYER_TURN;
        this.indicators.clear();
        this.interface.cancelMove();
    }

    requestAttack(entity) {}

    confirmAttack(entity) {}

    requestSkillsMenu(entity) {}

    requestSkill(entity) {}

    confirmSkill(entity) {}

    requestWait(entity) {
        if (this.state !== this.states.PLAYER_TURN)
            return;
        this.interface.endTurn().then(() => this.nextTurn());
    }

    confirmWait(entity) {}

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
        // TODO
    }

    onMouseWheel(event) {
        console.log(event);
    }

    onClick(event) {
        switch(this.state) {
            case this.states.NONE:
                break;
            case this.states.MOVE_REQUEST:
                const location = Game.camera._windowToTile(event.x, event.y, this.layout);
                this.confirmMove(location);
        }
    }

    onRightClick(event) {
        switch(this.state) {
            case this.states.MOVE_REQUEST:
                this.cancelMove();
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