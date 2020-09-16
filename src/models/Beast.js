class Beast {
    constructor(config, tileset) {

        // ----------------------
        // STATS
        // ----------------------------

        this.id = config.id;
        this.allegiance = 0;
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

        this.basic = config.basic;
        this.skills = config.skills || new Array();

        // --------------------
        // ACTIONS
        // -------------------------------

        this.actions = new Object();
        this.actions.basic = null;
        this.actions.skills = null;

        // ---------------------
        // COMBAT STATE
        // ----------------------

        this.energy = 0;

        this.lastLocation;
        this.lastOrientation;
        this.totalMoved = 0;
        this.lastMoved = 0;

        this.hasAttacked = false;

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
        this.orientation = config.orientation || Game.logic.general.ORIENTATIONS.SOUTH;

        // ----------------------
        // ANIMATIONS
        // ---------------------------

        this.tileset = tileset;

        // queued animations and movement
        this.animationQueue = new Array();

        // current animation
        this.animation = null;
    }
    
    _initialize(location) {
        // set location and defaults at beginning of combat
        this.energy = 0;
        this.location = location;
        this.animation = this.getDefaultAnimation(null);
    }

    getWeaponSkillId() {
        return this.equipment.getWeaponSkillId();
    }

    // ----------------------
    // COMBAT COMMANDS / HELPERS
    // ---------------------------

    resetTurn() {
        this.lastLocation = null;
        this.lastOrientation = null;
        this.totalMoved = 0;
        this.lastMoved = 0;
        this.hasAttacked = false;
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

    getAttackData() {
        const data = new Object();
        data.range = new Object();
        data.range.distance = 1;
        data.range.pattern = 'CROSS_EXCLUSIVE';
        data.range.z = 1;
        data.selection = new Object();
        data.selection.pattern = 'POINT';
        data.selection.distance = 1;
        data.selection.z = 1;

        return data;
    }

    canAttack() {
        return !this.hasAttacked;
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

    canPhase() {
        return false;
    }

    isFlying() {
        return (this.canFly() || this.canFloat()) && this.location.isHazard();
    }

    isSwimming() {
        return this.canSwim() && this.location.isWater();
    }
    
    moveTo(destination, animation_id = null, orientation = null, event = null) {
        const animation = this._getAnimationData({ id: animation_id, orientation, destination, event });
        this.animationQueue.push(animation);
    }
    
    walkTo(destination, range) {
        let next = destination;
    
        const moves = [];
        
    
        while(range.get(next)?.previous !== undefined) {
            if (!range.get(next).isHazard) {
                const move = new Object();
                move.location = next;
                move.event = (next === destination) ? 'move-complete' : 'move-step';
                moves.unshift(move);
            }
    
            next = range.get(next)?.previous;
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

    _setMovementType(animation, start, end) {
        const O   = Game.logic.general.getOrientationTo(end, start),
              SO  = start.getOrientation(),
              EO  = end.getOrientation(),
              OSO = SO ? Game.logic.general.getOppositeOrientation(SO) : undefined,
              OEO = EO ? Game.logic.general.getOppositeOrientation(EO) : undefined,
              DIFF = Math.abs(end.x - start.x) + Math.abs(end.y - start.y),
              DIFF_Z = end.getZ() - start.getZ();
          
        if (Math.abs(DIFF_Z) <= 1 && (SO !== undefined || EO !== undefined)) {
            animation.sloped |= (SO === EO        && ((DIFF_Z < 0 && OSO == O) || (DIFF_Z > 0  && SO  == O)));
            animation.sloped |= (SO === undefined && ((DIFF_Z > 0 && EO  == O) || (DIFF_Z == 0 && OEO == O)));
            animation.sloped |= (EO === undefined && ((DIFF_Z < 0 && OSO == O) || (DIFF_Z == 0 && SO  == O)));
        }

        animation.orientation = O;

        if (DIFF > 1 && Math.abs(DIFF_Z) <= 1)
            return 'leap';

        if (animation.sloped && DIFF <= 1)
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
        const w    = (start.tw / 2) * 4,
              d    = (start.td / 2) * 4,
              h    = (start.th / 2) * 4,
              x    = (end.x - start.x),
              y    = (end.y - start.y),
              z    = (end.getZ() - start.getZ()),
              s    = (~~end.isSloped()) - (~~start.isSloped());

        const dist = Math.abs((end.x - start.x)) + Math.abs((end.y - start.y)),
              swap = (end.x > start.x || end.y > start.y) && ((z === 0 && s >= 0) || animation.sloped);

        // swap rendering location immediately on animation start
        animation.swap = swap;

        // derived initial and current offset
        animation.ix = animation.cx = ~~swap * ((x  - y) * w + (start.getOffsetX() - end.getOffsetX()));
        animation.iy = animation.cy = ~~swap * ((-x - y) * d + (start.getOffsetY() - end.getOffsetY()));
        animation.iz = animation.cz = ~~swap * (-(s * h) + (z * start.th * 4));

        // derived target offset
        animation.tx = ~~!swap * ((y - x) * w - (start.getOffsetX() - end.getOffsetX()));
        animation.ty = ~~!swap * ((x + y) * d - (start.getOffsetY() - end.getOffsetY()));
        animation.tz = ~~!swap * ((s * h) - (z * start.th * 4));

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

    _getFrameMeta(animation) {
        return animation.meta[(animation.variation ? 'variation' : 'frames')][animation.frame];
    }

    getAnimationConfig(base) {
        if (this.isFlying()) {
            const config = this.tileset.config[`${base}-flying`]?.[this.orientation];
            if (config !== undefined)
                return config;
        }
        if (this.isSwimming()) {
            const config = this.tileset.config[`${base}-swimming`]?.[this.orientation];
            if (config !== undefined)
                return config;
        }
        return this.tileset.config[base][this.orientation];
    }

    getDefaultAnimation(previous = null) {
        const animation = new Object(),
              config = this.getAnimationConfig('idle');

        animation.id = 'idle';
        animation.variation = !previous?.variation;
        animation.mirrored = Boolean(config.mirrored);
        animation.config = (animation.variation && config.variation !== undefined) ? config.variation : config.frames;
        animation.ms = previous?.ms || 0;
        animation.frame = 0;
        animation.destination = this.location;
        animation.orientation = this.orientation;
        animation.movement = false;
        animation.events = new Array();
        animation.ox = ~~config.ox;
        animation.oy = ~~config.oy;

        return animation;
    }
}