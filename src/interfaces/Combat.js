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

        this.markers = new Object();
        this.markers.focus = new Object();
        this.markers.focus.ms = 0;
        this.markers.focus.duration = 750;

        this.markers.white = new Object();
        this.markers.white.index = 0;
        this.markers.white.opacity = 0.2;
        this.markers.white.ms = 0;
        this.markers.white.duration = 4000;

        this.markers.red = new Object();
        this.markers.red.index = 2;
        this.markers.red.opacity = 1;
        this.markers.red.ms = 0;
        this.markers.red.duration = 4000;

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

    async _load() {
        const portraits = resolve => {
            this.img = new Image();
            this.img.onload = resolve;
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}miscellaneous${OS_FILE_SEPARATOR}combat-ui-tiles.png`;
        };
        const markers = resolve => {
            this.markers.img = new Image();
            this.markers.img.onload = resolve;
            this.markers.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}miscellaneous${OS_FILE_SEPARATOR}tile-markers.png`;
        };
        await Promise.all([new Promise(portraits), new Promise(markers)]);
    }

    update(step) {
        // -----------------
        // Tile Marker Animations
        // -----------------------
        Object.values(this.markers).forEach(config => config.ms = (config.ms + step) % config.duration);

        // --------------------
        // UI Animations
        // ----------------------
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

    renderMarkers(delta, ctx, camera, location, range, path, selection, focus) {
        const rangeMarker     = range.get(location),
              pathMarker      = path.includes(location),
              selectionMarker = selection.get(location),
              focusMarker     = focus === location;

        if (rangeMarker !== undefined || selectionMarker !== undefined || focusMarker) {
            const isSloped   = location.isSloped(),
                  isMirrored = isSloped && [CombatLogic.ORIENTATIONS.WEST, CombatLogic.ORIENTATIONS.EAST].includes(location.getOrientation()),
                  xIndex     = ~~isSloped * ([CombatLogic.ORIENTATIONS.WEST, CombatLogic.ORIENTATIONS.NORTH].includes(location.getOrientation()) ? 1 : 2),
                  translateX = camera.getPosX() + (location.getPosX() * Game.scaling) + (~~isMirrored * 32 * Game.scaling),
                  translateY = camera.getPosY() + (location.getPosY() * Game.scaling);
            
            ctx.save();
            ctx.translate(translateX, translateY);

            if (isMirrored)
                ctx.scale(-1, 1);

            let config = null;

            if (selectionMarker !== undefined && selectionMarker.isSelectable) {
                config = this.markers[selectionMarker.color];
            } else if (rangeMarker !== undefined && rangeMarker.isSelectable) {
                config = this.markers[rangeMarker.color];
            }

            if (config !== null) {
                const deltaMs = (config.ms + delta) % config.duration;
                ctx.globalAlpha = config.opacity + Math.floor(Math.abs(deltaMs - (config.duration / 2))) / (config.duration * 2) + (~~pathMarker * 0.4);
                ctx.drawImage(this.markers.img, xIndex * 32, config.index * 32, 32, 24, 0, 0, (32 * Game.scaling), (24 * Game.scaling));
                ctx.globalAlpha = 1;
            }

            if (focusMarker) {
                const deltaMs = (this.markers.focus.ms + delta) % this.markers.focus.duration,
                      derivedIndex = Math.floor((deltaMs % (this.markers.focus.duration * .75)) / (this.markers.focus.duration * .25)),
                      overflowIndex = ~~!derivedIndex * Math.floor(deltaMs / (this.markers.focus.duration * .5));
                ctx.drawImage(this.markers.img, (derivedIndex + overflowIndex) * 32, (xIndex * 32) + 96, 32, 24, 0, 0, (32 * Game.scaling), (24 * Game.scaling));
            }

            ctx.restore();
        }
    }

    renderOrientation(delta, ctx, camera, beast, orientation) {
        if (orientation === null)
            return;

        const translateX = camera.getPosX() + ((beast.location.getPosX()) * Game.scaling),
              translateY = camera.getPosY() + ((beast.location.getPosY() - beast.tileset.th + beast.location.td + 3) * Game.scaling);

        let x, y;
        switch(orientation) {
            case CombatLogic.ORIENTATIONS.NORTH:
                x = 0;
                y = 0;
                break;
            case CombatLogic.ORIENTATIONS.EAST:
                x = 0;
                y = 1;
                break;
            case CombatLogic.ORIENTATIONS.SOUTH:
                x = 1;
                y = 1;
                break;
            case CombatLogic.ORIENTATIONS.WEST:
                x = 1;
                y = 0;
                break;
        }

        ctx.save();
        ctx.translate(translateX, translateY);
        ctx.drawImage(this.markers.img, x * 32, (y * 16) + 192, 32, 16, 0, 0, (32 * Game.scaling), (16 * Game.scaling))
        ctx.restore();
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

    async resetMove(unit) {
        this.menu.dom.actions_move.classList.toggle('dim', false);
        this._updateHeight(unit.location.getZ());
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
