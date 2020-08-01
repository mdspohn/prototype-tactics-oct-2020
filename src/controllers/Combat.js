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


        this.menu.dom.actions_wait.addEventListener('click', () => {
            Events.dispatch('turn-end');
        })
    }

    async _load() {

    }

    update(step) {
        this.animations.forEach(animation => {
            animation.value += (animation.target - animation.value) * Math.min(step / animation.ms, 1);
            animation.ms = Math.max(animation.ms - step, 0);
        });
    }

    render(delta) {
        for (let i = this.animations.length - 1; i >= 0; i--) {
            if ((this.animations[i].ms - delta) <= 0) {
                this.animations[i].element.style[this.animations[i].style] = this.animations[i].target + this.animations[i].suffix;
                if (this.animations[i].event) {
                    Events.dispatch(this.animations[i].event);
                    this.animations.splice(i, 1);
                }
            } else {
                const change = (this.animations[i].target - this.animations[i].value) * Math.min(delta / this.animations[i].ms, 1);
                this.animations[i].element.style[this.animations[i].style] = (this.animations[i].value + change) + this.animations[i].suffix;
            }
        }
    }

    async nextTurn(entity) {
        const HP_PAD = '000'.substr(0, (Math.max(3 - String(entity.health).length, 0))),
              TP_PAD = '000'.substr(0, (Math.max(3 - String(entity.tp).length, 0)));
        
        this.active.dom.name.innerText     = entity.name;
        this.active.dom.level.innerText    = ('0' + entity.level).slice(-2);
        this.active.dom.hp_cur.innerHTML   = `<span class="dim">${HP_PAD}</span>${entity.health}`;
        this.active.dom.tp_cur.innerHTML   = `<span class="dim">${TP_PAD}</span>${entity.tp}`;
        this.active.dom.hp_max.innerText   = ('00' + entity.health).slice(-3);
        this.active.dom.tp_max.innerText   = '300';
        this.active.dom.hp_bar.style.width = Math.ceil((entity.health / entity.health) * 100) + '%';
        this.active.dom.tp_bar.style.width = Math.ceil((entity.tp / 300) * 100) + '%';

        this.animations.push({
            element: this.active.dom.wrapper,
            style: 'left',
            target: 20,
            value: -20,
            ms: 500,
            suffix: 'px',
            event: 'active-show'
        },
        {
            element: this.active.dom.wrapper,
            style: 'opacity',
            target: 1,
            value:  0,
            ms: 500,
            suffix: ''
        });

        return new Promise((resolve) => Events.listen('active-show', () => resolve()));
    }

    async endTurn(entity) {
        this.animations.push({
            element: this.active.dom.wrapper,
            style: 'left',
            target: -20,
            value: 20,
            ms: 500,
            suffix: 'px',
            event: 'active-hide'
        },
        {
            element: this.active.dom.wrapper,
            style: 'opacity',
            target: 0,
            value:  1,
            ms: 500,
            suffix: ''
        });

        return new Promise((resolve) => Events.listen('active-hide', () => resolve()));
    }

    async requestMove() {

    }

    async confirmMove() {

    }

    async requestAttack() {

    }

    async confirmAttack() {

    }

    async requestSkills() {

    }

    async confirmSkill() {

    }

    async requestWait() {

    }

    async confirmWait() {

    }

    updateTurns(order) {
        console.table(order.new);
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

        Events.listen('turn-order', data => this.interface.updateTurns(data), true);
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
        this.turns.active.walkTo(Game.camera.windowToTile(event.x, event.y, this.layout), this.layout);
    }

    onRightClick(event) {

    }

    onKeyUp(event) {

    }
}