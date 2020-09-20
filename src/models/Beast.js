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

        this.checkpoint = new Object();
        this.checkpoint.animation = null;
        this.checkpoint.last = 0;
        this.checkpoint.total = 0;

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
        this.orientation = config.orientation || CombatLogic.ORIENTATIONS.SOUTH;

        // ----------------------
        // ANIMATIONS
        // ---------------------------

        this.tileset = tileset;

        // current animation
        this.animation = null;

        // queued animations and movement
        this.animationQueue = new Array();

    }
    
    initialize(location) {
        // set location and defaults at beginning of combat
        this.energy = 0;
        this.location = location;
        this.animation = this.getDefaultAnimation(null);
    }

    getWeaponSkillId() {
        return this.equipment.getWeaponSkillId();
    }

    resetTurn() {
        this.checkpoint.animation = null;
        this.checkpoint.last = 0;
        this.checkpoint.total = 0;
        this.hasAttacked = false;
    }

    getMovement() {
        return this.move - this.checkpoint.total;
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

    // ----------------------
    // ANIMATIONS
    // ---------------------------

    getAnimationConfig(base, orientation = this.orientation) {
        return this.tileset.config[base][orientation];
    }

    getDefaultAnimation(previous = null) {
        const animation = new Object(),
              config = this.getAnimationConfig('idle', this.orientation);

        animation.id = 'idle';
        animation.variation = !previous?.variation;
        animation.mirrored = Boolean(config.mirrored);
        animation.config = (animation.variation && config.variation !== undefined) ? config.variation : config.frames;
        animation.ms = previous?.ms || 0;
        animation.multipliers = new Array(animation.config.length).fill(1);
        animation.frame = 0;
        animation.destination = this.location;
        animation.orientation = this.orientation;
        animation.movement = false;
        animation.events = new Object();
        animation.x = animation.ox = ~~config.ox;
        animation.y = animation.oy = ~~config.oy;

        return animation;
    }
}