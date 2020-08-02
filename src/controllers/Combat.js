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
        this.menu.dom.actions_wait.addEventListener('click', () => Events.dispatch('turn-end'));
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
            animation.current += (animation.target - animation.current) * Math.min(step / animation.ms, 1);
            animation.ms = Math.max(animation.ms - step, 0);
        });

        if (this.turns.pending)
            this.turns.offset = Math.floor(Math.max(this.turns.offset - ((step / 500) * 32), 0));
    }

    render(delta) {
        for (let i = this.animations.length - 1; i >= 0; i--) {
            if ((this.animations[i].ms - delta) <= 0) {
                this.animations[i].element.style[this.animations[i].style] = this.animations[i].target + this.animations[i].suffix;
                if (this.animations[i].event) {
                    Events.dispatch(this.animations[i].event);
                }
                this.animations.splice(i, 1);
            } else {
                const change = (this.animations[i].target - this.animations[i].current) * Math.min(delta / this.animations[i].ms, 1);
                this.animations[i].element.style[this.animations[i].style] = (this.animations[i].current + change) + this.animations[i].suffix;
            }
        }

        if (this.turns.pending) {
            const offset = Math.floor(Math.max(this.turns.offset - ((delta / 500) * 32), 0));
            if (offset === 0)
                this.turns.pending = false;
            
            this.turns.order.forEach((entity, index) => {
                const x = (index * 32),
                      clear = (index === 0),
                      opacity = (index === 0) ? (Math.max(offset - 16, 0) / 16) : (index === this.turns.order.length - 1) ? 1 - (offset / 32) : 1;
                this._renderEntity(this.turns.dom.canvas, this.turns.ctx, entity, false, clear, x + offset, true, opacity);
            });
        }
    }

    _animateElement(element, style, target, ms = 500, suffix = '', event = null) {
        let current = element.style[style];
        if (current === '')
            current = window.getComputedStyle(element)[style];
        current = ~~current.replace(suffix, '');
        this.animations.push({ element, style, current, target, ms, suffix, event });
    }

    _setElement(element, style, value, suffix = '') {
        element.style[style] = value + suffix;
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
        this.turns.order = order.new;
        this.turns.pending = true;
        if (order.old?.[0]) {
            this.turns.order.unshift(order.old[0]);
            this.turns.offset = 32;
        }
    }

    async nextTurn(entity) {
        this._updateUnit(this.active, entity);
        this._setElement(this.active.dom.wrapper, 'left', 10, 'px');
        this._animateElement(this.active.dom.wrapper, 'left',   30, 500, 'px', 'active-show');
        this._animateElement(this.active.dom.wrapper, 'opacity', 1, 500);
        this._renderEntity(this.active.dom.canvas, this.active.ctx, entity);
        
        return new Promise((resolve) => Events.listen('active-show', resolve));
    }

    async endTurn() {
        this._animateElement(this.active.dom.wrapper, 'left',  50, 500, 'px', 'active-hide');
        this._animateElement(this.active.dom.wrapper, 'opacity', 0, 500);

        return new Promise((resolve) => Events.listen('active-hide', resolve));
    }

    async requestMove() {

    }

    async cancelMove() {

    }

    async confirmMove() {

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

        this.turns = new TurnManager();
        this.indicators = new CombatIndicators();
        this.interface = new CombatInterface();

        Events.listen('turn-order', data => this.interface._updateTurns(data), true);
        Events.listen('turn-end', () => this.endTurn(), true);
    }

    async _load() {
        await Promise.all([this.indicators._load(), this.interface._load()]);
    }

    async _prepare(scene) {
        this.map = scene.map;
        this.decoration = scene.decoration;
        this.entities = scene.entities;
        this.layout = new Layout(this.map, this.entities);
    }

    async _initialize() {
        this.entities.forEach(entity =>  entity.reset(this.layout.getLocation(entity.initialX, entity.initialY)));
        this.turns.use(this.entities);
        // set initial settings before game swaps to rendering this controller
    }

    // -------------------
    // COMBAT STATE CHANGES
    // --------------------------

    start() {
        Game.camera.toCenter(Game.canvas, this.layout);
        this.nextTurn();
    }

    endTurn() {
        this.interface.endTurn().then(() => this.nextTurn());
        this.indicators.range = null;
    }

    nextTurn() {
        this.turns.next();
        this.interface.nextTurn(this.turns.active).then(() => {
            this.indicators.display('movement', this.turns.active.getRange(this.layout, this.entities));
        });
    }

    // -------------------
    // ENGINE LOOP
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
            location.getOccupants().forEach(occupant => occupant.render(delta, location));
        });
        this.interface.render(delta);
    }

    // -------------------
    // INPUT MEDIATION
    // --------------------------

    onClick(event) {
        const location = Game.camera.windowToTile(event.x, event.y, this.layout);
        if (location !== undefined)
            this.turns.active.walkTo(Game.camera.windowToTile(event.x, event.y, this.layout), this.layout);
    }

    onRightClick(event) {

    }

    onKeyUp(event) {

    }
}