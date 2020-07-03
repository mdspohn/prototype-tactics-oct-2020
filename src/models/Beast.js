class Beast {
    constructor(config) {
        this.tileset;
        this.tileset_id = config.tileset;

        // positioning
        this.x = config.x;
        this.y = config.y;

        // animation states
        this.ix = 0;
        this.iy = 0;
        this.iz = 0;

        this.tx = 0;
        this.ty = 0;
        this.tz = 0;

        this.ox = 0;
        this.oy = 0;

        this.actions = new Array();
        this.animations = config.animations;
        this.frame = null;

        // display information
        this.name = config.name || config.species;
        this.species = config.species;

        // base combat stats
        this.hp = config.hp;
        this.speed = config.speed;
        this.initiative = config.initiative;
        this.stamina = 0;
        this.movement = this.speed;

        // derived information
        this.range = null;

        if (!this.animations.idle.initialized) {
            Object.entries(this.animations).forEach(entry => {
                const animation = new Object();
                animation.frames = entry[1].map(frame => {
                    return {
                        id: frame.id,
                        event: frame.event,
                        ms: frame.ms,       // frame duration
                        x:  frame.x  || 0,  // x offset
                        y:  frame.y  || 0,  // y offset
                        p:  frame.p  || 0,  // movement progress
                        zd: frame.zd || 0,  // z down progress
                        zu: frame.zu || 0   // z up progress
                    }
                });
                animation.initialized = true;
                this.animations[entry[0]] = animation;
            });
        }
        
        this.frame = this.animations['idle'].frames[0];
        this.queueAnimation('idle', false, { repeat: true });
    }

    async _prepare(assets) {
        this.tileset = assets[this.tileset_id];
        if (this.tileset == undefined) {
            this.tileset = new Tileset(Data.getTileset(this.tileset_id, 'beasts'));
            await this.tileset._load();
            assets[this.tileset_id] = this.tileset;
        }
    }

    update(step) {
        if (this.actions[0].sorting)
            this._broadcastAnimationSorting(this.actions[0]);

        if (this.actions[0].type === 'event')
            return this._broadcastAnimationEvent(this.actions.shift());

        let isAnimationComplete = false,
            msAccumulated = this.actions[0].sinceLast,
            animationProgress = 0,
            zProgress = 0;

        this.animations[this.actions[0].id].frames.some((frame, index) => {
            if (this.actions[0].movement) {
                const progress = Math.min(msAccumulated / frame.ms, 1);
                if (frame.p !== 0)
                    animationProgress += progress * frame.p;
                
                if (this.actions[0].z > 0 && frame.zd) {
                    zProgress += progress * frame.zd;
                } else if (this.actions[0].z < 0 && frame.zu) {
                    zProgress += progress * frame.zu;
                }
            }

            msAccumulated -= frame.ms;
            
            if (msAccumulated <= 0) {
                if (this.actions[0].sinceLast === 0 && this.actions[0].movement) {
                    this.tx = -(this.actions[0].x - this.x) * (TILE_WIDTH / 2);
                    this.tx += (this.actions[0].y - this.y) * (TILE_WIDTH / 2);
                    this.ty =  (this.actions[0].x - this.x) * (TILE_DEPTH / 2);
                    this.ty += (this.actions[0].y - this.y) * (TILE_DEPTH / 2);
                    this.tz =  (this.actions[0].z * TILE_HEIGHT);
                }
                return this.frame = frame;
            }
            
            if (msAccumulated > 0) {
                const hasEvent = msAccumulated < step && this.frame.event != undefined,
                      isLastFrame = (this.animations[this.actions[0].id].frames.length - 1) == index;
                
                if (hasEvent)
                    this._broadcastAnimationEvent({ id: this.frame.event });
                
                if (isLastFrame) {
                    if (this.actions[0].movement) {
                        this.x = this.actions[0].x;
                        this.y = this.actions[0].y;
                        this.ox = this.oy = 0;
                        this.tx = this.ty = this.tz = 0;
                        this.ix = this.iy = this.iz = 0;
                    }

                    const previousAction = this.actions.shift();

                    if (previousAction.repeat) {
                        previousAction.sinceLast = 0;
                        this.actions.push(previousAction);
                    }
                    return isAnimationComplete = true;
                }
            }
        });

        // should current render tile be switched if moving
        if (!isAnimationComplete) {
            const hasProgress = (this.x != this.actions[0].x || this.y != this.actions[0].y) && animationProgress > 0;

            if (hasProgress) {
                const isRenderedAfter = (this.actions[0].y + this.actions[0].x - this.x - this.y) > 0,
                      isAlmostDoneJumpingUp = !(this.actions[0].z < 0) || zProgress > 0.9,
                      isAlmostDoneJumpingDown = this.actions[0].z > 0 && (this.actions[0].x > this.x || animationProgress > 0.3);
                
                if ((isRenderedAfter && isAlmostDoneJumpingUp) || isAlmostDoneJumpingDown) {
                    this.ix =  -(this.x - this.actions[0].x) * (TILE_WIDTH / 2);
                    this.ix +=  (this.y - this.actions[0].y) * (TILE_WIDTH / 2);
                    this.iy =   (this.x - this.actions[0].x) * (TILE_DEPTH / 2);
                    this.iy +=  (this.y - this.actions[0].y) * (TILE_DEPTH / 2);
                    this.iz =  -(this.actions[0].z * TILE_HEIGHT);
                    this.tx = 0;
                    this.ty = 0;
                    this.tz = 0;

                    this.x = this.actions[0].x;
                    this.y = this.actions[0].y;
                }
            }

            this.ox = this.ix + Math.ceil(animationProgress * (this.tx - this.ix)) + (this.frame.x || 0);
            this.oy = this.iy + Math.ceil(animationProgress * (this.ty - this.iy)) + (this.iz + Math.ceil(zProgress * (this.tz - this.iz))) + (this.frame.y || 0);

            this.actions[0].sinceLast += step;
        }
    }
    
    render(delta, loc) {
        const animationRow = Math.floor(this.frame.id / 10),
              animationCol = this.frame.id % 10;
        
        Game.ctx.save();
        Game.ctx.translate(
            Game.camera.position.x + loc.posX - ((this.tileset.tw - loc.tw) / 2) + this.ox,
            Game.camera.position.y + loc.posY - (this.tileset.th - loc.td) + this.oy + (loc.slope * (loc.th / 2))
        );
        Game.ctx.drawImage(
            this.tileset.img,
            animationCol * this.tileset.tw,
            animationRow * this.tileset.th,
            this.tileset.tw,
            this.tileset.th,
            0,
            0,
            this.tileset.tw,
            this.tileset.th
        );
        Game.ctx.restore();
        // adjust translation for location height, beast width, and any current animation
        // const x = translate.x + ((translate.w - this.sprite.width) / 2) + this.ox,
        //       y = translate.y - ((location.z * translate.h) + this.sprite.height - 24) + this.oy;

        // const animationRow = Math.floor(this.frame.id / 10),
        //       animationCol = this.frame.id % 10;
        
        // Game.ctx.save();
        // Game.ctx.translate(x, y);
        // Game.ctx.drawImage(this.sprite.img,
        //                    animationCol * this.sprite.width, animationRow * this.sprite.height, this.sprite.width, this.sprite.height,
        //                    0, 0, this.sprite.width, this.sprite.height);
        // Game.ctx.restore();
    }

    _getAnimationAction(id, hasEvent = true, properties = {}) {
        const actions = new Array();
        actions.push(Object.assign({ id, type: 'animation', sinceLast: 0, repeat: false, movement: false }, properties));

        if (hasEvent) 
            actions.push({ id: `${id}-complete`, type: 'event', data: this });

        return actions;
    }

    forceAnimation(id, hasEvent = true, properties = {}) {
        this._getAnimationAction(id, hasEvent, properties).reverse().forEach(action => this.actions.unshift(action));
    }

    queueAnimation(id, hasEvent = true, properties = {}) {
        this._getAnimationAction(id, hasEvent, properties).forEach(action => this.actions.push(action));
    }
    
    clone(opts = {}) {
        return Object.assign(new Beast(this), opts);
    }

    getMovementRange(layout, entities) {
        this.range = new Object();
        
        const addTile = (x, y, px, py, steps = 0) => {
            if (!layout[x] || !layout[x][y] || !layout[x][y].tiles)
                return;
            
            if (!entities.some(entity => entity != this && entity.x == x && entity.y == y)) {
                this.range[x] = this.range[x] || new Object();

                if (this.range[x][y] != undefined && this.range[x][y].steps <= steps)
                    return;
        
                this.range[x][y] = {
                    px,
                    py,
                    steps,
                    showMarker: x != this.x || y != this.y
                };
        
                if (steps >= this.movement)
                    return;
                
                addTile(Math.max(x - 1, 0), y, x, y, (steps + 1));
                addTile(x, Math.min(y + 1, layout[x].length - 1), x, y, (steps + 1));
                addTile(Math.min(x + 1, layout.length - 1), y, x, y, (steps + 1));
                addTile(x, Math.max(y - 1, 0), x, y, (steps + 1));
            }
        };
        
        addTile(this.x, this.y, void 0, void 0);
        return this.range;
    }
    
    canMoveTo({ x, y } = target) {
        return !(x == this.x && y == this.y) && this.range != null && this.range[x] != undefined && this.range[x][y] != undefined;
    }
    
    moveTo({ x, y } = target) {
        let sequence = this._getAnimationAction('move', true, { movement: true, x, y, z: 0 }),
            previous = this.range[x][y];
    
        while (previous != undefined && previous.px != undefined) {
            const action = this._getAnimationAction('move', false, {
                movement: true,
                x: previous.px,
                y: previous.py,
                z: 0
            })[0];
    
            const tile = this.map.layout[previous.px][previous.py],
                  nextTile = this.map.layout[sequence[0].x][sequence[0].y],
                  zChange = tile.z - nextTile.z,
                  xChange = tile.x - nextTile.x,
                  animationId = (zChange != 0) ? 'jump' : 'move';
            
            this.movement -= 1;
            
            sequence[0].id = animationId;
            sequence[0].z = zChange;
            sequence[0].sorting = (xChange != 0) ? 'y' : 'x';
    
            previous = this.range[previous.px][previous.py];
    
            if (previous.px != undefined)
                sequence.unshift(action);
        }
        
        // TODO race condition ??
        this.actions.push(...sequence);
        return new Promise((resolve, reject) => Events.listen('move-complete', () => resolve()));
    }

    attack(target, skill) {
        this.queueAnimation('attack');
        Events.listen('hit', () => target.defend());
        return new Promise((resolve, reject) => Events.listen('attack-complete', () => resolve()));
    }

    defend() {
        this.forceAnimation('defend');
    }

    _broadcastAnimationSorting(action) {
        Game.controllers[GAME_STATES.COMBAT].map.sortBy(action.sorting);
        action.sorting = false;
    }

    _broadcastAnimationEvent(event) {
        Events.dispatch(event.id, event.data);
    }

    AI(wait = 0) {
        return new Promise((resolve, reject) => setTimeout(() => resolve(), wait));
    }
}