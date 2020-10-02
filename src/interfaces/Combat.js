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
        this.menu.dom.actions_move.addEventListener('click', (e) => {
            e.stopPropagation();
            Events.dispatch('MOVE_REQUEST');
        });
        this.menu.dom.actions_attack.addEventListener('click', (e) => {
            e.stopPropagation();
            Events.dispatch('ATTACK_REQUEST');
        });
        this.menu.dom.actions_skills.addEventListener('click', (e) => {
            e.stopPropagation();
            Events.dispatch('SKILLS_MENU');
        });
        this.menu.dom.actions_wait.addEventListener('click', (e) => {
            e.stopPropagation();
            Events.dispatch('WAIT_REQUEST');
        });
    }

    async load() {
        const loader = resolve => {
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

    _renderEntity(canvas, ctx, unit, showTile = true, clearCanvas = true, x = 0, mirrored = false, opacity = 1) {
        if (clearCanvas === true)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (showTile === true)
            this.active.ctx.drawImage(this.img, 0, 0, 32, 48, 0, canvas.height - 48, 32, 48);
        
        ctx.save();
        if (opacity !== 1)
            ctx.globalAlpha = opacity;
        
        BeastRenderer.renderCustom(ctx, unit, 0, mirrored, x, (canvas.height - unit.tileset.sh) - (~~showTile * 8), { scaling: 1 });
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

    _updateUnit(element, unit) {
        const HP_PAD = '000'.substr(0, (Math.max(3 - String(unit.stats.current.health).length, 0))),
              TP_PAD = '000'.substr(0, (Math.max(3 - String(unit.stats.current.tp).length, 0)));
        
        element.dom.name.innerText = unit.name;
        element.dom.level.innerText = ('0' + unit.level).slice(-2);
        element.dom.hp_cur.innerHTML = `<span class="dim">${HP_PAD}</span>${unit.stats.current.health}`;
        element.dom.tp_cur.innerHTML = `<span class="dim">${TP_PAD}</span>${unit.stats.current.tp}`;
        element.dom.hp_max.innerText = ('00' + unit.stats.max.health).slice(-3);
        element.dom.tp_max.innerText = '300';
        element.dom.hp_bar.style.width = Math.ceil((unit.stats.current.health / unit.stats.max.health) * 100) + '%';
        element.dom.tp_bar.style.width = Math.ceil((unit.stats.current.tp / unit.stats.max.tp) * 100) + '%';
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
        this._updateHeight(entity.location.z);
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

    async resetMove(unit) {
        this.menu.dom.actions_move.classList.toggle('dim', false);
        this._updateHeight(unit.location.z);
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

    async requestSkill() {

    }

    async cancelSkill() {

    }

    async confirmSkill() {

    }
}
