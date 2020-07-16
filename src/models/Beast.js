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
        this.x = () => (this.location != null) ? this.location.x : config.x;
        this.y = () => (this.location != null) ? this.location.y : config.y;

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

    _verifyAnimationId(animation, mod) {
        if (this.meta[animation.id + mod] != undefined) {
            animation.id += mod;
            return '';
        }
        return mod;
    }

    _setMovementType(animation, start, end) {
        // const z = start.z() - end.z(),
        //       axis = ((start.x - end.x) != 0) ? 'X' : 'Y',
        //       orientation = (((start.x + start.y) - (end.x + end.y)) > 0) ? 'UP' : 'DOWN';
        
        // animation.id = 'walk';
        // let mod = '';

        // if (z != 0) {
        //     animation.id = 'jump';
        //     mod = this._verifyAnimationId(animation, (z < 0) ? '-up' : '-down');
        // }
        // if (Math.abs(z) >= 2) {
        //     animation.id = 'jump';
        //     mod = this._verifyAnimationId(animation, (z < 0) ? '-up' : '-down');
        // } else if (z != 0) {
        //     animation.id = 'jump';
        //     mod = this._verifyAnimationId(animation, (z < 0) ? '-up' : '-down');
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
        const w    = (start.tw / 2),
              d    = (start.td / 2),
              h    = (start.th / 2),
              x    = (end.x - start.x),
              y    = (end.y - start.y),
              z    = (start.z()) - (end.z()),
              s    = (~~end.slope()) - (~~start.slope()),
              swap = (end.x > start.x || end.y > start.y) && (z === 0);

        // swap rendering location immediately on animation start
        animation.swap = swap;

        // derived initial and current offset
        animation.ix = ~~swap * ((x  - y) * w);
        animation.iy = ~~swap * ((-x - y) * d);
        animation.iz = ~~swap * (-(s * h) - (z * start.th));

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

    _reverseOffsets(animation) {
        this.location = animation.destination;
        [animation.ix, animation.tx] = [-animation.tx, -animation.ix];
        [animation.iy, animation.ty] = [-animation.ty, -animation.iy];
        [animation.iz, animation.tz] = [-animation.tz, -animation.iz];
    }

    moveTo(destination, animationId = null) {
        this.animationQueue.push(this._getAnimationData(animationId, destination));
    }

    _handleAnimationComplete(META) {
        const NEXT = this.animationQueue.shift(),
              REMAINING_MS = this.animation.ms;

        if (META.event !== undefined)
            Events.dispatch(META.event, this);

        // animation finished, so swap to new location if it hasn't been done yet
        if (this.animation.destination !== undefined && this.animation.destination !== this.location)
            this.location = this.animation.destination;
        
        this.animation = (NEXT !== undefined) ? NEXT : this.defaultAnimation;
        this.animation.ms = REMAINING_MS;
        this.animation.frame = 0;

        if (!this.animation.movement)
            return;

        // immediately swap rendering location if we need to
        this.location = (this.animation.swap) ? this.animation.destination : this.location;

        // broadcast new sorting order
        Events.dispatch('sort', ((this.animation.destination.x - this.location.x) !== 0) ? 'Y' : 'X');
    }

    _handleFrameComplete(META, FRAME_META) {
        // broadcast frame event
        if (FRAME_META.event)
            Events.dispatch(FRAME_META.event, this);
        
        // update animation progress
        if (this.animation.movement) {
            this.animation.px += FRAME_META.px || 0;
            this.animation.py += FRAME_META.py || 0;
            this.animation.pz += FRAME_META.pz || 0;
        }

        this.animation.ms -= FRAME_META.ms;
        this.animation.frame += 1;

        // still in the same animation, nothing more to update
        if (this.animation.frame >= META.frames.length)
            return this._handleAnimationComplete(META);
    }

    update(step) {
        const META = this.meta[this.animation.id],
              FRAME_META = META.frames[this.animation.frame];

        this.animation.ms += step;

        if (this.animation.ms > FRAME_META.ms)
            return this._handleFrameComplete(META, FRAME_META);
    }
    
    render(delta) {
        let META = this.meta[this.animation.id],
            FRAME_META = META.frames[this.animation.frame];
        
        // check if frame should swap
        if (FRAME_META.ms <= (this.animation.ms + delta)) {
            this._handleFrameComplete(META, FRAME_META);
            
            META = this.meta[this.animation.id];
            FRAME_META = META.frames[this.animation.frame];
        }
        
        // nothing to do
        if (FRAME_META.idx === -1) 
            return;

        // update movement offsets
        if (this.animation.movement) {
            const PROGRESS_FRAME = Math.min(((this.animation.ms + delta) / FRAME_META.ms), 1),
                  PROGRESS_X = this.animation.px + (PROGRESS_FRAME * (FRAME_META.px || 0)),
                  PROGRESS_Y = this.animation.py + (PROGRESS_FRAME * (FRAME_META.py || 0)),
                  PROGRESS_Z = this.animation.pz + (PROGRESS_FRAME * (FRAME_META.pz || 0));

            if (PROGRESS_Z !== 0 && this.location.z() != this.animation.destination.z()) {
                const DIFF_Z = (this.location.z() - this.animation.destination.z()),
                      DIFF_XY = (this.location.x + this.location.y) - (this.animation.destination.x + this.animation.destination.y),
                      SLOPE_CASE = (DIFF_XY < 0) && this.animation.destination.slope();
                
                // reverse offsets and change render location
                if ((DIFF_Z < 0 && (PROGRESS_Z === 1 || SLOPE_CASE) || DIFF_Z > 0) && (DIFF_XY <= 0 || !this.location.slope()))
                    this._reverseOffsets(this.animation);
            }

            this.animation.cx = this.animation.ix + Math.round(PROGRESS_X * (this.animation.tx - this.animation.ix));
            this.animation.cy = this.animation.iy + Math.round(PROGRESS_Y * (this.animation.ty - this.animation.iy));
            this.animation.cz = this.animation.iz + Math.round(PROGRESS_Z * (this.animation.tz - this.animation.iz));
        }

        const x = Game.camera.position.x + this.location.posX() - ((this.tw - this.location.tw) / 2),
              y = Game.camera.position.y + this.location.posY() - ((this.th - this.location.th) - (this.location.td / 2)) + (~~this.location.slope() * (this.location.th / 2));
        
        Game.ctx.save();
        Game.ctx.translate(x, y);
        Game.ctx.drawImage(
            this.tileset,
            FRAME_META.idx * this.tw % this.tileset.width,
            Math.floor((FRAME_META.idx * this.tw) / this.tileset.width) * (this.th),
            this.tw,
            this.th,
            ~~FRAME_META.ox + ~~this.animation.cx,
            ~~FRAME_META.oy + ~~this.animation.cy + ~~this.animation.cz,
            this.tw,
            this.th
        );
        Game.ctx.restore();
    }

    // getMovementRange(layout, entities) {
    //     this.range = new Object();
        
    //     const addTile = (x, y, px, py, steps = 0) => {
    //         if (!layout[x] || !layout[x][y] || !layout[x][y].tiles)
    //             return;
            
    //         if (!entities.some(entity => entity != this && entity.x == x && entity.y == y)) {
    //             this.range[x] = this.range[x] || new Object();

    //             if (this.range[x][y] != undefined && this.range[x][y].steps <= steps)
    //                 return;
        
    //             this.range[x][y] = {
    //                 px,
    //                 py,
    //                 steps,
    //                 showMarker: x != this.x || y != this.y
    //             };
        
    //             if (steps >= this.movement)
    //                 return;
                
    //             addTile(Math.max(x - 1, 0), y, x, y, (steps + 1));
    //             addTile(x, Math.min(y + 1, layout[x].length - 1), x, y, (steps + 1));
    //             addTile(Math.min(x + 1, layout.length - 1), y, x, y, (steps + 1));
    //             addTile(x, Math.max(y - 1, 0), x, y, (steps + 1));
    //         }
    //     };
        
    //     addTile(this.x, this.y, void 0, void 0);
    //     return this.range;
    // }
    
    // canMoveTo({ x, y } = target) {
    //     return !(x == this.x && y == this.y) && this.range != null && this.range[x] != undefined && this.range[x][y] != undefined;
    // }
    
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

    // attack(target, skill) {
    //     this.queueAnimation('attack');
    //     Events.listen('hit', () => target.defend());
    //     return new Promise((resolve, reject) => Events.listen('attack-complete', () => resolve()));
    // }

    // defend() {
    //     this.forceAnimation('defend');
    // }

    // _broadcastAnimationSorting(action) {
    //     Game.controllers[GAME_STATES.COMBAT].map.sortBy(action.sorting);
    //     action.sorting = false;
    // }

    // _broadcastAnimationEvent(event) {
    //     Events.dispatch(event.id, event.data);
    // }

    // AI(wait = 0) {
    //     return new Promise((resolve, reject) => setTimeout(() => resolve(), wait));
    // }
}