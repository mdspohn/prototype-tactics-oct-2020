class Beast {
    constructor(config, tileset) {

        // ----------------------
        // STATS
        // ----------------------------

        this.id = config.id;
        this.name = config.name;
        this.level = 1;
        this.experience = 0;

        this.health  = Math.max(~~config.stats.health,  1);
        this.attack  = Math.max(~~config.stats.attack,  1);
        this.defense = Math.max(~~config.stats.defense, 0);
        this.spirit  = Math.max(~~config.stats.spirit,  1);
        this.resist  = Math.max(~~config.stats.resist,  0);

        this.tp = 0;

        this.block   = Math.max(~~config.stats.block,   0);
        this.evasion = Math.max(~~config.stats.evasion, 0);
        this.move    = Math.max(~~config.stats.move,  1);
        this.jump    = Math.max(~~config.stats.jump,  1);
        this.speed   = Math.max(~~config.stats.speed, 1);

        // ---------------------
        // COMBAT STATE
        // ----------------------

        this.energy = 0;

        this.lastLocation;
        this.lastOrientation;
        this.totalMoved = 0;
        this.lastMoved = 0;

        // ----------------------
        // EQUIPMENT
        // ---------------------------

        this.equipment = new EquipmentManager();

        // ----------------------
        // POSITION
        // ---------------------------
        
        this.location;
        this.initialX = config.x;
        this.initialY = config.y;
        this.x = () => (this.location != null) ? this.location.x : this.initialX;
        this.y = () => (this.location != null) ? this.location.y : this.initialY;

        // current directional facing
        this.orientation = config.orientation || 'south';

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
        this.animation = this._getDefaultAnimation();
    }
    
    _initialize(location) {
        // set location and defaults at beginning of combat
        this.energy = 0;
        this.location = location;
    }

    // ----------------------
    // COMBAT COMMANDS / HELPERS
    // ---------------------------

    resetTurn() {
        this.lastLocation = null;
        this.lastOrientation = null;
        this.totalMoved = 0;
        this.lastMoved = 0;
    }

    resetMove() {
        if (this.lastLocation === null)
            return;
        
        this.animation.destination = this.lastLocation;
        this.orientation = this.lastOrientation;
        this._handleAnimationComplete(this.animation.meta);

        this.lastLocation = null;
        this.lastOrientation = null;
        this.totalMoved -= this.lastMoved;
        this.lastMoved = 0;
    }

    getMovement() {
        return this.move - this.totalMoved;
    }

    canMove() {
        // determine whether beast is allowed to move (has moved already, root, etc...)
        return this.getMovement() > 0;
    }

    canSwim() {
        return false;
    }

    canFloat() {
        return false;
    }

    canFly() {
        return false;
    }
    
    moveTo(destination, animation_id = null, orientation = null, event = null) {
        const animation = this._getAnimationData({ id: animation_id, orientation, destination, event });
        this.animationQueue.push(animation);
    }
    
    walkTo(destination, layout) {
        let x = destination.x,
            y = destination.y;
    
        const moves = [];
    
        while(this.range?.[x]?.[y]?.px !== undefined) {
            const move = new Object();
            move.location = layout.getLocation(x, y);
            move.event = (x == destination.x && y == destination.y) ? 'move-complete' : 'move-step';
            moves.unshift(move);
    
            let newX = this.range[x][y].px,
                newY = this.range[x][y].py;
            
            x = newX;
            y = newY;
        }
    
        // set variables for being able to reset movement choice
        this.lastLocation = this.lastLocation || this.location;
        this.lastOrientation = this.lastOrientation || this.orientation;
        const distanceTraveled = Math.abs(destination.x - this.location.x) + Math.abs(destination.y - this.location.y);
        this.lastMoved += distanceTraveled;
        this.totalMoved += distanceTraveled;

        // execute movement
        moves.forEach(move => this.moveTo(move.location, null, null, move.event));
    }
    
    getRange(layout, entities) {
        const range = new Object();
            
        const addTile = (x, y, px, py, steps = 0) => {
            if (layout.getLocation(x, y) === undefined)
                return;
            
            if (!entities.some(entity => entity != this && entity.x() == x && entity.y() == y)) {
                range[x] = range[x] || new Object();
    
                if (range[x][y] != undefined && range[x][y].steps <= steps)
                    return;
        
                range[x][y] = {
                    px,
                    py,
                    steps,
                    showMarker: x != this.x() || y != this.y()
                };
        
                if (steps >= this.getMovement())
                    return;
                
                addTile(Math.max(x - 1, 0), y, x, y, (steps + 1));
                addTile(x, Math.min(y + 1, layout.structure[x].length - 1), x, y, (steps + 1));
                addTile(Math.min(x + 1, layout.structure.length - 1), y, x, y, (steps + 1));
                addTile(x, Math.max(y - 1, 0), x, y, (steps + 1));
            }
        };
        
        addTile(this.x(), this.y(), void 0, void 0);
        this.range = range;
        return range;
    }

    // ----------------------
    // ANIMATIONS
    // ---------------------------

    _getDefaultAnimation() {
       return this._getAnimationData(this._verifyAnimation('idle', this.orientation));
    }

    _verifyAnimation(id, orientation) {
        const animation = new Object();
        animation.id = id;
        animation.orientation = this.meta[id][orientation] !== undefined ? orientation : this.orientation;
        animation.variation = this.meta[id][orientation].variation !== undefined;
        animation.meta = this.meta[id][orientation] || this.meta[id];

        return animation;
    }

    _getOrientationToTarget(target, location = this.location) {
        const DX = (target.x - location.x),
              DY = (target.y - location.y);
        
        return [
            ['north', -DX],
            ['south', +DX],
            ['east',  +DY],
            ['west',  -DY]
        ].sort((a, b) => b[1] - a[1])[0][0];
    }

    _getOppositeOrientation(orientation) {
        switch(orientation) {
            case 'north':
                return 'south';
            case 'east':
                return 'west';
            case 'south':
                return 'north';
            case 'west':
                return 'east';
            default:
                break;
        }
    }

    _setMovementType(animation, start, end) {
        const O   = this._getOrientationToTarget(end, start),
              SO  = start.orientation(),
              EO  = end.orientation(),
              OSO = this._getOppositeOrientation(SO),
              OEO = this._getOppositeOrientation(EO),
              DIFF_Z = end.z() - start.z();
          
        if (Math.abs(DIFF_Z) <= 1 && (SO !== undefined || EO !== undefined)) {
            animation.sloped |= (SO === EO        && ((DIFF_Z < 0 && OSO == O) || (DIFF_Z > 0  && SO  == O)));
            animation.sloped |= (SO === undefined && ((DIFF_Z > 0 && EO  == O) || (DIFF_Z == 0 && OEO == O)));
            animation.sloped |= (EO === undefined && ((DIFF_Z < 0 && OSO == O) || (DIFF_Z == 0 && SO  == O)));
        }

        animation.orientation = O;

        if (animation.sloped)
            return 'walk';

        if (Math.abs(DIFF_Z) > 0)
            return (DIFF_Z > 0) ? 'jump-up' : 'jump-down';

        // at least one tile is a slope, but there is no z change if we're here
        if (SO !== undefined && EO !== undefined) {
            if (SO === EO && ![SO, OSO].includes(O))
                return 'walk';
            return (SO == O) ? 'jump-down' : 'jump-up';
        } else if (SO === undefined && EO === undefined) {
            return 'walk';
        }

        return (SO !== undefined) ? 'jump-up' : 'jump-down';
    }

    _setMovementData(animation, start, end) {
        const w    = (start.tw / 2),
              d    = (start.td / 2),
              h    = (start.th / 2),
              x    = (end.x - start.x),
              y    = (end.y - start.y),
              z    = (end.z() - start.z()),
              s    = (~~end.isSlope()) - (~~start.isSlope());

        const dist = Math.abs((end.x - start.x)) + Math.abs((end.y - start.y)),
              swap = (end.x > start.x || end.y > start.y) && ((z === 0 && dist <= 1 && s >= 0) || animation.sloped);

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

    _getAnimationData({ id, orientation = this.orientation, destination, event = null } = opts) {
        // need to derive animation and movement data
        const PREVIOUS = this.animationQueue[this.animationQueue.length - 1] || this.animation,
              START = PREVIOUS?.destination || this.location,
              END = destination || START;
        
        const animation = new Object();
        animation.id = id;
        animation.ms = 0;
        animation.frame = 0;
        animation.destination = END;
        animation.orientation = orientation;
        animation.event = event;

        if (id === null)
            animation.id = this._setMovementType(animation, START, END);
        
        Object.assign(animation, this._verifyAnimation(animation.id, animation.orientation));
        animation.variation &= !PREVIOUS?.variation && ['walk', 'idle'].includes(PREVIOUS?.id);

        if (END !== START)
            this._setMovementData(animation, START, END);

        animation.ox = ~~animation.meta.ox;
        animation.oy = ~~animation.meta.oy;
        animation.movement = START != END;

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

        if (this.animation.event !== null)
            Events.dispatch(this.animation.event, this);

        // animation finished, so swap to new location if it hasn't been done yet
        if (this.animation.destination !== undefined && this.animation.destination !== this.location)
            this.location = this.animation.destination;
        
        this.animation = NEXT || this._getDefaultAnimation();
        this.animation.ms = REMAINING_MS;
        this.animation.frame = 0;

        this.orientation = this.animation.orientation || this.orientation;

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

    _getFrameMeta(animation) {
        return animation.meta[(animation.variation ? 'variation' : 'frames')][animation.frame];
    }

    // ----------------------
    // ENGINE HOOKS
    // ---------------------------

    update(step) {
        let FRAME_META = this._getFrameMeta(this.animation);

        this.animation.ms += step;

        while (this.animation.ms > FRAME_META.ms) {
            this._handleFrameComplete(this.animation.meta, FRAME_META);
            FRAME_META = this._getFrameMeta(this.animation);
        }
    }
    
    render(delta) {
        let FRAME_META = this._getFrameMeta(this.animation);
        
        // check if frame should swap
        while ((this.animation.ms + delta) > FRAME_META.ms) {
            this._handleFrameComplete(this.animation.meta, FRAME_META);
            FRAME_META = this._getFrameMeta(this.animation);
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

        const X = Game.camera.posX() + this.location.posX() - ((this.tw - this.location.tw) / 2),
              Y = Game.camera.posY() + this.location.posY() - ((this.th - this.location.th) - (this.location.td / 2)) + (~~this.location.isSlope() * (this.location.th / 2)),
              OFFSET_X = ~~this.animation.ox + ~~FRAME_META.ox + ~~this.animation.cx,
              OFFSET_Y = ~~this.animation.oy + ~~FRAME_META.oy + ~~this.animation.cy + ~~this.animation.cz,
              IS_MIRRORED = this.animation.meta.mirrored;
        
        this.equipment.render(Game.ctx, -1, FRAME_META.idx, IS_MIRRORED, X + OFFSET_X, Y + OFFSET_Y);

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

        this.equipment.render(Game.ctx, 1, FRAME_META.idx, IS_MIRRORED, X + OFFSET_X, Y + OFFSET_Y);
    }

    renderToUICanvas(ctx, x, y, IS_MIRRORED) {
        this.equipment.render(ctx, -1, 0, IS_MIRRORED, x, y);
        ctx.save();
        ctx.translate(x + (~~IS_MIRRORED * this.tw), y);
        if (IS_MIRRORED)
            ctx.scale(-1, 1);
        ctx.drawImage(this.tileset, 0, 0, this.tw, this.th, 0, 0, this.tw, this.th);
        ctx.restore();
        this.equipment.render(ctx, 1, 0, IS_MIRRORED, x, y);
    }
}