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
        this.location;
        this.x = () => this.location != null ? this.location.x : config.x;
        this.y = () => this.location != null ? this.location.y : config.y;

        // queued animations and movement
        this.animationQueue = new Array();

        // current animation
        this.animation = this._getAnimationData('idle');
        this.defaultAnimation = new Object(this.animation);

        // current directional facing
        this.direction = 'south';
    }

    async _prepare() {
        const loader = (resolve) => {
            this.tileset.onload = resolve;
            this.tileset.src = this.tileset_src;
        };
        await new Promise(loader);
    }

    _setMovementType(animation, start, end) {
        // if (!!start.slope() || !!end.slope()) {

        //     return;
        // }


        if (start.z() == end.z()) {
            animation.id = 'move';
        } else if (Math.abs(start.z() - end.z()) > 1) {
            animation.id = 'jump-';
            animation.id += (start.z() - end.z() < 0) ? 'up' : 'down';
        } else if (start.slope() || end.slope()) {
            animation.id = 'move';
        } else {
            animation.id = 'jump-';
            animation.id += (start.z() - end.z() < 0) ? 'up' : 'down';
        }
    }

    _setMovementData(animation, start, end) {
        const swap = (end.x > start.x || end.y > start.y), // swap rendering to new tile
              w    = (start.tw / 2),
              d    = (start.td / 2),
              h    = (start.th / 2),
              x    = (end.x - start.x),
              y    = (end.y - start.y),
              z    = (start.z()) - (end.z()),
              s    = (~~end.slope()) - (~~start.slope());

        // derived initial and current offset
        animation.ix = ~~swap *  ((x - y) * w);
        animation.iy = ~~swap * -((x - y) * d);
        animation.iz = ~~swap *  ((s * h) - (z * start.th));

        animation.cx = animation.ix;
        animation.cy = animation.iy;
        animation.cz = animation.iz;

        // derived target offset
        animation.tx = ~~!swap * ((y - x) * w);
        animation.ty = ~~!swap * ((x + y) * d);
        animation.tz = ~~!swap * ((s * h) + (z * start.th));

        // current movement progress
        animation.px = 0;
        animation.py = 0;
        animation.pz = 0;
    }

    _getAnimationData(animationId, destination) {
        const animation = new Object();
        animation.id    = animationId;
        animation.ms    = 0;
        animation.frame = 0;

        // need to derive animation and movement data
        const start = this.animationQueue[(this.animationQueue.length - 1)]?.destination || this.location,
              end   = animation.destination = destination || this.location;

        if (animation.id === null)
            this._setMovementType(animation, start, end);

        if (end !== start)
            this._setMovementData(animation, start, end);

        animation.ox = ~~this.meta[animation.id].ox;
        animation.oy = ~~this.meta[animation.id].oy;
        animation.movement = Boolean(this.meta[animation.id].movement);

        return animation;
    }

    moveTo(destination, animationId = null) {
        this.animationQueue.push(this._getAnimationData(animationId, destination));
    }

    update(step) {
        this.animation.ms += step;

        // no frame change
        const ms = this.meta[this.animation.id].frames[this.animation.frame].ms;
        if (ms < this.animation.ms) {
            // handle animation frame event
            if (this.meta[this.animation.id].frames[this.animation.frame].event)
                Events.dispatch(this.meta[this.animation.id].frames[this.animation.frame].event, this);
            
            if (this.animation.movement) {
                // add all movement progress from this frame
                this.animation.px += this.meta[this.animation.id].frames[this.animation.frame].px || 0;
                this.animation.py += this.meta[this.animation.id].frames[this.animation.frame].py || 0;
                this.animation.pz += this.meta[this.animation.id].frames[this.animation.frame].pz || 0;
            }

            this.animation.ms -= ms;
            this.animation.frame += 1;

            // animation requested tile change
            if (this.animation.frame >= this.meta[this.animation.id].frames.length) {
                const next = this.animationQueue.shift(),
                      remaining = this.animation.ms;

                // handle any animation completion events
                if (this.meta[this.animation.id].event)
                    Events.dispatch(this.meta[this.animation.id].event, this);

                // finalize movement of previous animation
                if (this.animation.destination !== undefined && this.animation.destination !== this.location)
                    this.location = this.animation.destination;
                
                this.animation = (next === undefined) ? this.defaultAnimation : next;
                this.animation.frame = 0;
                this.animation.ms = remaining;

                if (this.animation.movement) {
                    Events.dispatch('sort', !!(this.animation.destination.x - this.location.x) ? 'Y' : 'X');
                    // swap rendering location if we need to
                    if (this.animation.destination.x > this.location.x || this.animation.destination.y > this.location.y)
                        this.location = this.animation.destination;
                }
            }
        }
    }
    
    render(delta) {
        const x = Game.camera.position.x + this.location.posX() - (this.tw - this.location.tw) / 2,
              y = Game.camera.position.y + this.location.posY() - (this.th - (this.location.td / 2) - this.location.th);

        let next  = this.animation,
            frame = this.animation.frame,
            idx   = this.meta[next.id].frames[frame].idx;
        
        // check if we should be rendering the next frame
        if ((this.animation.ms + delta) > this.meta[this.animation.id].frames[this.animation.frame].ms) {
            frame = this.animation.frame + 1;

            // animation requested tile change
            if (frame >= this.meta[this.animation.id].frames.length) {
                next = (this.animationQueue[0] === undefined) ? this.defaultAnimation : this.animationQueue[0];
                frame = 0;
            }

            idx = this.meta[next.id].frames[frame].idx;
        }

        if (this.animation.movement) {
            const framePercentage = Math.min((this.animation.ms + delta) / this.meta[this.animation.id].frames[this.animation.frame].ms, 1),
                  totalXDistance = this.animation.tx - this.animation.ix,
                  totalYDistance = this.animation.ty - this.animation.iy,
                  totalZDistance = this.animation.tz - this.animation.iz;
            
            this.animation.cx = this.animation.ix + Math.round((this.animation.px + framePercentage * (this.meta[this.animation.id].frames[this.animation.frame].px || 0)) * totalXDistance);
            this.animation.cy = this.animation.iy + Math.round((this.animation.py + framePercentage * (this.meta[this.animation.id].frames[this.animation.frame].py || 0)) * totalYDistance);
            this.animation.cz = this.animation.iz + Math.round((this.animation.pz + framePercentage * (this.meta[this.animation.id].frames[this.animation.frame].pz || 0)) * totalZDistance);
        }


        this.animation.ox = ~~this.meta[next.id].frames[frame].ox;
        this.animation.oy = ~~this.meta[next.id].frames[frame].oy;

        // move on if tile requested is empty
        if (idx === -1) 
            return;

        Game.ctx.save();
        Game.ctx.translate(x, y + (~~this.location.slope() * (this.location.th / 2)));
        Game.ctx.drawImage(
            this.tileset,
            idx * this.tw % this.tileset.width,
            Math.floor((idx * this.tw) / this.tileset.width) * (this.th),
            this.tw,
            this.th,
            this.animation.ox + ~~this.animation.cx,
            this.animation.oy + ~~this.animation.cy + ~~this.animation.cz,
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
    
    // moveTo({ x, y } = target) {
    //     let sequence = this._getAnimationAction('move', true, { movement: true, x, y, z: 0 }),
    //         previous = this.range[x][y];
    
    //     while (previous != undefined && previous.px != undefined) {
    //         const action = this._getAnimationAction('move', false, {
    //             movement: true,
    //             x: previous.px,
    //             y: previous.py,
    //             z: 0
    //         })[0];
    
    //         const tile = this.map.layout[previous.px][previous.py],
    //               nextTile = this.map.layout[sequence[0].x][sequence[0].y],
    //               zChange = tile.z - nextTile.z,
    //               xChange = tile.x - nextTile.x,
    //               animationId = (zChange != 0) ? 'jump' : 'move';
            
    //         this.movement -= 1;
            
    //         sequence[0].id = animationId;
    //         sequence[0].z = zChange;
    //         sequence[0].sorting = (xChange != 0) ? 'y' : 'x';
    
    //         previous = this.range[previous.px][previous.py];
    
    //         if (previous.px != undefined)
    //             sequence.unshift(action);
    //     }
        
    //     // TODO race condition ??
    //     this.actions.push(...sequence);
    //     return new Promise((resolve, reject) => Events.listen('move-complete', () => resolve()));
    // }

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