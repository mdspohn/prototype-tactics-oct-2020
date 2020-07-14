class Beast {
    constructor(config) {
        // tileset config
        this.tileset_id = config.tileset;
        this.tile_config = Data.getTileset(this.tileset_id, 'beasts');
        this.tileset_src = `${ASSET_DIR}${OS_FILE_SEPARATOR}${this.tile_config.directory}${OS_FILE_SEPARATOR}${this.tile_config.src}`;
        this.tileset = new Image();

        // sprite dimensions
        this.tw = ~~this.tile_config.measurements.sprite.width;
        this.td = ~~this.tile_config.measurements.sprite.depth;
        this.th = ~~this.tile_config.measurements.sprite.height;

        // animation data
        this.meta = this.tile_config.config;

        // beast location
        this.x = config.x;
        this.y = config.y;

        // initial movement offsets
        this.ix = 0;
        this.iy = 0;
        this.iz = 0;

        // target movement offsets
        this.tx = 0;
        this.ty = 0;
        this.tz = 0;

        // current movement offsets
        this.ox = 0;
        this.oy = 0;
        this.oz = 0;

        // current movement progress
        this.p = 0;
        this.pd = 0;
        this.pu = 0;

        // current animation
        this.animation = new Object();
        this.animation.id = 'idle';
        this.animation.frame = 0;
        this.animation.ms = 0;
        this.animation.ox = 0;
        this.animation.oy = 0;

        this.defaultAnimation = 'idle';

        // queued animations and actions
        this.animationQueue = new Array();
        this.movementQueue = new Array();

        // current directional facing
        this.direction = 'south';
    }

    async _prepare() {
        await new Promise(resolve => {
            this.tileset.onload = resolve;
            this.tileset.src = this.tileset_src;
        });
    }

    update(step) {
        this.animation.ms += step;

        // no frame change
        const ms = this.meta[this.animation.id].frames[this.animation.frame].ms;
        if (ms >= this.animation.ms)
            return;

        this.animation.ms -= ms;
        this.animation.frame += 1;

        // animation requested tile change
        if (this.animation.frame >= this.meta[this.animation.id].frames.length) {
            const next = this.animationQueue.shift();
            this.animation.id = (next === undefined) ? this.defaultAnimation : next;
            this.animation.frame = 0;
        }
        // if (this.actions[0].sorting)
        //     this._broadcastAnimationSorting(this.actions[0]);

        // if (this.actions[0].type === 'event')
        //     return this._broadcastAnimationEvent(this.actions.shift());

        // let isAnimationComplete = false,
        //     msAccumulated = this.actions[0].sinceLast,
        //     animationProgress = 0,
        //     zProgress = 0;

        // this.animations[this.actions[0].id].frames.some((frame, index) => {
        //     if (this.actions[0].movement) {
        //         const progress = Math.min(msAccumulated / frame.ms, 1);
        //         if (frame.p !== 0)
        //             animationProgress += progress * frame.p;
                
        //         if (this.actions[0].z > 0 && frame.zd) {
        //             zProgress += progress * frame.zd;
        //         } else if (this.actions[0].z < 0 && frame.zu) {
        //             zProgress += progress * frame.zu;
        //         }
        //     }

        //     msAccumulated -= frame.ms;
            
        //     if (msAccumulated <= 0) {
        //         if (this.actions[0].sinceLast === 0 && this.actions[0].movement) {
        //             this.tx = -(this.actions[0].x - this.x) * (TILE_WIDTH / 2);
        //             this.tx += (this.actions[0].y - this.y) * (TILE_WIDTH / 2);
        //             this.ty =  (this.actions[0].x - this.x) * (TILE_DEPTH / 2);
        //             this.ty += (this.actions[0].y - this.y) * (TILE_DEPTH / 2);
        //             this.tz =  (this.actions[0].z * TILE_HEIGHT);
        //         }
        //         return this.frame = frame;
        //     }
            
        //     if (msAccumulated > 0) {
        //         const hasEvent = msAccumulated < step && this.frame.event != undefined,
        //               isLastFrame = (this.animations[this.actions[0].id].frames.length - 1) == index;
                
        //         if (hasEvent)
        //             this._broadcastAnimationEvent({ id: this.frame.event });
                
        //         if (isLastFrame) {
        //             if (this.actions[0].movement) {
        //                 this.x = this.actions[0].x;
        //                 this.y = this.actions[0].y;
        //                 this.ox = this.oy = 0;
        //                 this.tx = this.ty = this.tz = 0;
        //                 this.ix = this.iy = this.iz = 0;
        //             }

        //             const previousAction = this.actions.shift();

        //             if (previousAction.repeat) {
        //                 previousAction.sinceLast = 0;
        //                 this.actions.push(previousAction);
        //             }
        //             return isAnimationComplete = true;
        //         }
        //     }
        // });

        // // should current render tile be switched if moving
        // if (!isAnimationComplete) {
        //     const hasProgress = (this.x != this.actions[0].x || this.y != this.actions[0].y) && animationProgress > 0;

        //     if (hasProgress) {
        //         const isRenderedAfter = (this.actions[0].y + this.actions[0].x - this.x - this.y) > 0,
        //               isAlmostDoneJumpingUp = !(this.actions[0].z < 0) || zProgress > 0.9,
        //               isAlmostDoneJumpingDown = this.actions[0].z > 0 && (this.actions[0].x > this.x || animationProgress > 0.3);
                
        //         if ((isRenderedAfter && isAlmostDoneJumpingUp) || isAlmostDoneJumpingDown) {
        //             this.ix =  -(this.x - this.actions[0].x) * (TILE_WIDTH / 2);
        //             this.ix +=  (this.y - this.actions[0].y) * (TILE_WIDTH / 2);
        //             this.iy =   (this.x - this.actions[0].x) * (TILE_DEPTH / 2);
        //             this.iy +=  (this.y - this.actions[0].y) * (TILE_DEPTH / 2);
        //             this.iz =  -(this.actions[0].z * TILE_HEIGHT);
        //             this.tx = 0;
        //             this.ty = 0;
        //             this.tz = 0;

        //             this.x = this.actions[0].x;
        //             this.y = this.actions[0].y;
        //         }
        //     }

        //     this.ox = this.ix + Math.ceil(animationProgress * (this.tx - this.ix)) + (this.frame.x || 0);
        //     this.oy = this.iy + Math.ceil(animationProgress * (this.ty - this.iy)) + (this.iz + Math.ceil(zProgress * (this.tz - this.iz))) + (this.frame.y || 0);

        //     this.actions[0].sinceLast += step;
        // }
    }
    
    render(delta, location) {
        const x = Game.camera.position.x + location.posX() - (this.tw - location.tw) / 2,
              y = Game.camera.position.y + location.posY() - (this.th - (location.td / 2) - location.th);

        let next = this.animation.id,
            frame = this.animation.frame,
            idx = this.meta[next].frames[frame].idx;
        
        // check if we should be rendering the next frame
        if ((this.animation.ms + delta) > this.meta[this.animation.id].frames[this.animation.frame].ms) {
            frame = this.animation.frame + 1;

            // animation requested tile change
            if (frame >= this.meta[this.animation.id].frames.length) {
                next = (this.animationQueue[0] === undefined) ? this.defaultAnimation : this.animationQueue[0];
                frame = 0;
            }

            idx = this.meta[next].frames[frame].idx;
        }

        this.animation.ox = ~~this.meta[next].frames[frame].ox;
        this.animation.oy = ~~this.meta[next].frames[frame].oy;

        // move on if tile requested is empty
        if (idx === -1) 
            return;

        Game.ctx.save();
        Game.ctx.translate(x + this.ox, y + this.oy + (~~location.slope() * (location.th / 2)));
        Game.ctx.drawImage(
            this.tileset,
            idx * this.tw % this.tileset.width,
            Math.floor((idx * this.tw) / this.tileset.width) * (this.th),
            this.tw,
            this.th,
            this.animation.ox,
            this.animation.oy,
            this.tw,
            this.th
        );
        Game.ctx.restore();
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