class Beast {
    constructor(config, tileset) {

        // ----------------------
        // STATS
        // ----------------------------

        this.level = 1;
        this.experience = 0;

        this.health  = 1;
        this.attack  = 1;
        this.defense = 0;
        this.spirit  = 1;
        this.resist  = 0;

        this.tp = 0;

        this.block = 0;
        this.evasion = 0;
        this.move = 5;
        this.jump = 2;
        this.speed = 50;

        // ----------------------
        // EQUIPMENT
        // ---------------------------

        this.equipment = new EquipmentManager();

        // this.anima_1 = Game.equipment.get('anima', config.anima_1);
        // this.anima_2 = Game.equipment.get('anima', config.anima_2);
        // this.anima_3 = Game.equipment.get('anima', config.anima_3);

        // ----------------------
        // POSITION
        // ---------------------------
        
        this.location;
        this.initialX = config.x;
        this.initialY = config.y;
        this.x = () => (this.location != null) ? this.location.x : this.initialX;
        this.y = () => (this.location != null) ? this.location.y : this.initialY;

        // current directional facing
        this.orientation = config.orientation || 's';

        // ----------------------
        // ANIMATIONS
        // ---------------------------

        this.tileset = tileset.img;

        // sprite dimensions
        this.tw = tileset.tw;
        this.td = tileset.td;
        this.th = tileset.th;

        // sprite animation data
        this.meta = tileset.config;

        // queued animations and movement
        this.animationQueue = new Array();

        // current animation
        this.animation = this._getAnimationData(this._verifyAnimation('idle', this.orientation));
        this.defaultAnimation = () => this._getAnimationData(this._verifyAnimation('idle', this.orientation));

    }

    async _prepare() {
        // reset beast
    }

    _verifyAnimation(id, ...mods) {
        const full = id + '-' + mods.join('-'),
              partial = id + '-' + mods[0];

        if (this.meta[full] !== undefined)
            return full;
        return (this.meta[partial] !== undefined) ? partial : id;
    }

    _getOrientationToTarget(target, location = this.location) {
        const DX = target.x - location.x,
              DY = target.y - location.y;
        
        return [
            ['n', -DX],
            ['s', +DX],
            ['e', +DY],
            ['w', -DY]
        ].sort((a, b) => b[1] - a[1])[0][0];
    }

    _getOppositeOrientation(orientation) {
        switch(orientation) {
            case 'n':
                return 's';
            case 'e':
                return 'w';
            case 's':
                return 'n';
            case 'w':
                return 'e';
            default:
                break;
        }
    }

    _setMovementType(animation, start, end) {
        const O   = animation.orientation = this._getOrientationToTarget(end, start),
              SO  = start.orientation(),
              EO  = end.orientation(),
              OSO = this._getOppositeOrientation(SO),
              OEO = this._getOppositeOrientation(EO),
              DIFF_Z = end.z() - start.z(),
              TILE_MOD = (start.x != end.x) ? end.x % 2 : end.y % 2;
          
        if (Math.abs(DIFF_Z) <= 1 && (SO !== undefined || EO !== undefined)) {
            animation.sloped |= (SO === EO        && ((DIFF_Z < 0 && OSO == O) || (DIFF_Z > 0  && SO  == O)));
            animation.sloped |= (SO === undefined && ((DIFF_Z > 0 && EO  == O) || (DIFF_Z == 0 && OEO == O)));
            animation.sloped |= (EO === undefined && ((DIFF_Z < 0 && OSO == O) || (DIFF_Z == 0 && SO  == O)));
        }

        if (animation.sloped)
            return this._verifyAnimation('walk', O, TILE_MOD);

        if (Math.abs(DIFF_Z) > 0)
            return this._verifyAnimation('jump-' + ((DIFF_Z > 0) ? 'up' : 'down'), O);

        // at least one tile is a slope, but there is no z change if we're here
        if (SO !== undefined && EO !== undefined) {
            if (SO === EO && ![SO, OSO].includes(O))
                return this._verifyAnimation('walk', O, TILE_MOD);
            return this._verifyAnimation((SO == O) ? 'jump-down' : 'jump-up', O);
        } else if (SO === undefined && EO === undefined) {
            return this._verifyAnimation('walk', O, TILE_MOD);
        }
        return this._verifyAnimation((SO !== undefined) ? 'jump-up' : 'jump-down', O);
    }

    _setMovementData(animation, start, end) {
        const w    = (start.tw / 2),
              d    = (start.td / 2),
              h    = (start.th / 2),
              x    = (end.x - start.x),
              y    = (end.y - start.y),
              z    = (end.z() - start.z()),
              s    = (~~end.slope()) - (~~start.slope());

        const dist = Math.abs((end.x - start.x)) + Math.abs((end.y - start.y)),
              swap = (end.x > start.x || end.y > start.y) && ((z === 0 && dist <= 1 && s === 0) || animation.sloped);

        // swap rendering location immediately on animation start
        animation.swap = swap;

        // derived initial and current offset
        animation.ix = animation.cx = ~~swap * ((x  - y) * w + (start.ox() - end.ox()));
        animation.iy = animation.cy = ~~swap * ((-x - y) * d + (start.oy() - end.oy()));
        animation.iz = animation.cz = ~~swap * (-(s * h) + (z * start.th));

        // derived target offset
        animation.tx = ~~!swap * ((y - x) * w - (start.ox() - end.ox()));
        animation.ty = ~~!swap * ((x + y) * d - (start.oy() - end.oy()));
        animation.tz = ~~!swap * ((s * h) - (z * start.th));

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
              end = animation.destination = (destination !== undefined) ? destination : (this.animationQueue[(this.animationQueue.length - 1)]?.destination || this.location);

        if (animation.id === null)
            animation.id = this._setMovementType(animation, start, end);

        if (end !== start)
            this._setMovementData(animation, start, end);

        animation.ox = ~~this.meta[animation.id].ox;
        animation.oy = ~~this.meta[animation.id].oy;
        animation.movement = start != end;

        return animation;
    }

    _reverseOffsets(animation) {
        this.location = animation.destination;
        [animation.ix, animation.tx] = [-animation.tx, -animation.ix];
        [animation.iy, animation.ty] = [-animation.ty, -animation.iy];
        [animation.iz, animation.tz] = [-animation.tz, -animation.iz];
    }

    _handleAnimationComplete(META) {
        const NEXT = this.animationQueue.shift(),
              REMAINING_MS = this.animation.ms;

        if (META.event !== undefined)
            Events.dispatch(META.event, this);

        // animation finished, so swap to new location if it hasn't been done yet
        if (this.animation.destination !== undefined && this.animation.destination !== this.location)
            this.location = this.animation.destination;
        
        this.animation = NEXT || this.defaultAnimation();
        this.animation.ms = REMAINING_MS;
        this.animation.frame = 0;

        if (this.animation.orientation !== undefined)
            this.orientation = this.animation.orientation;

        if (!this.animation.movement)
            return;

        // TODO: doesn't update until the next rendering cycle, so maybe this shouldn't ever be called by the render function?
        Events.dispatch('sort', ((this.animation.destination.x - this.location.x) !== 0) ? 'Y' : 'X');

        // immediately swap rendering location if we need to
        if (this.animation.swap)
            this.location = this.animation.destination;

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
            this._handleAnimationComplete(META);
    }

    update(step) {
        let FRAME_META = this.meta[this.animation.id].frames[this.animation.frame];

        this.animation.ms += step;

        while (this.animation.ms > FRAME_META.ms) {
            this._handleFrameComplete(this.meta[this.animation.id], FRAME_META);
            FRAME_META = this.meta[this.animation.id].frames[this.animation.frame];
        }
    }
    
    render(delta) {
        let FRAME_META = this.meta[this.animation.id].frames[this.animation.frame];
        
        // check if frame should swap
        while ((this.animation.ms + delta) > FRAME_META.ms) {
            this._handleFrameComplete(this.meta[this.animation.id], FRAME_META);
            FRAME_META = this.meta[this.animation.id].frames[this.animation.frame];
        }

        // update movement offsets
        if (this.animation.movement) {
            const PROGRESS_FRAME = Math.min(1, ((this.animation.ms + delta) / FRAME_META.ms)),
                  PROGRESS_X = this.animation.px + (PROGRESS_FRAME * (FRAME_META.px || 0)),
                  PROGRESS_Y = this.animation.py + (PROGRESS_FRAME * (FRAME_META.py || 0)),
                  PROGRESS_Z = this.animation.pz + (PROGRESS_FRAME * (FRAME_META.pz || 0)),
                  DIFF_Z  = this.location.z() - this.animation.destination.z();

            // figure out if we should swap to rendering from the destination location (height difference related stuff)
            if (PROGRESS_Z !== 0 && (this.animation.destination != this.location) && !this.animation.sloped && (PROGRESS_Z >= 1 || DIFF_Z > 0))
                this._reverseOffsets(this.animation);

            this.animation.cx = this.animation.ix + Math.round(PROGRESS_X * (this.animation.tx - this.animation.ix));
            this.animation.cy = this.animation.iy + Math.round(PROGRESS_Y * (this.animation.ty - this.animation.iy));
            this.animation.cz = this.animation.iz + Math.round(PROGRESS_Z * (this.animation.tz - this.animation.iz));
        }

        // nothing to do
        if (FRAME_META.idx === -1) 
            return;

        const X = Game.camera.position.x + this.location.posX() - ((this.tw - this.location.tw) / 2),
              Y = Game.camera.position.y + this.location.posY() - ((this.th - this.location.th) - (this.location.td / 2)) + (~~this.location.slope() * (this.location.th / 2)),
              OFFSET_X = ~~this.animation.ox + ~~FRAME_META.ox + ~~this.animation.cx,
              OFFSET_Y = ~~this.animation.oy + ~~FRAME_META.oy + ~~this.animation.cy + ~~this.animation.cz,
              IS_MIRRORED = this.meta[this.animation.id].mirror;
        
        //this.equipment.render(-1, this.animation, X + OFFSET_X, Y + OFFSET_Y);

        Game.ctx.save();
        Game.ctx.translate(X + (~~IS_MIRRORED * this.tw) + OFFSET_X, Y + OFFSET_Y);

        if (IS_MIRRORED)
            Game.ctx.scale(-1, 1);
        
        Game.ctx.drawImage(
            this.tileset,
            FRAME_META.idx * this.tw % this.tileset.width,
            Math.floor((FRAME_META.idx * this.tw) / this.tileset.width) * (this.th),
            this.tw,
            this.th,
            0,
            0,
            this.tw,
            this.th
        );
        Game.ctx.restore();

        this.equipment.render(1, this.animation, X + OFFSET_X, Y + OFFSET_Y);
    }
}

// ---------------------------
// Entity commands and interactions
// ------------------------

Beast.prototype.moveTo = function(destination, animationId = null) {
    this.animationQueue.push(this._getAnimationData(animationId, destination));
};


















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