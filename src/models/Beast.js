class Beast {
    constructor(config, tileset) {
        
        // ----------------------
        // General
        // ----------------------------

        this.id = config.id;
        this.name = config.name;
        this.ai = false;
        this.level = 1;
        this.experience = 0;
        this.allegiance = 0;

        // ----------------------
        // Status
        // ----------------------------

        this.stats = new Object();
        this.stats.max = new Object();
        this.stats.max.health  = Math.max(~~config.stats.health,  1);
        this.stats.max.attack  = Math.max(~~config.stats.attack,  1);
        this.stats.max.defense = Math.max(~~config.stats.defense, 0);
        this.stats.max.spirit  = Math.max(~~config.stats.spirit,  1);
        this.stats.max.resist  = Math.max(~~config.stats.resist,  0);
        this.stats.max.block   = Math.max(~~config.stats.block,   0);
        this.stats.max.evasion = Math.max(~~config.stats.evasion, 0);
        this.stats.max.move    = Math.max(~~config.stats.move,    1);
        this.stats.max.jump    = Math.max(~~config.stats.jump,    1);
        this.stats.max.speed   = Math.max(~~config.stats.speed,   1);
        this.stats.max.tp      = Math.max(~~config.stats.tp,      300);

        this.stats.current = { ...this.stats.max };
        this.stats.current.tp = 0;

        this.effects = new Object();
        this.effects.poison = false;
        this.effects.haste = false;
        this.effects.slow = false;
        this.effects.berserk = false;
        this.effects.regen = false;

        // ----------------------
        // Equipment
        // ---------------------------

        this.equipment = new BeastEquipment();

        // ------------------------
        // Skills
        // -------------------------------

        this.attack = 'sneak';
        this.skills = ['double-slash', 'leap-slash', 'magic'];

        // ---------------------
        // State
        // ----------------------

        this.energy = 0;
        this.traveled = new Object();
        this.traveled.last = 0;
        this.traveled.total = 0;
        this.usedSkill = false;
        this.usedAttack = false;

        // ----------------------
        // Position
        // ---------------------------
        
        this.location = new Object();
        this.location.x = config.x;
        this.location.y = config.y;
        this.orientation = config.orientation;

        // ----------------------
        // Animations
        // ---------------------------

        this.tileset = tileset;

        this.animations = new Object();
        this.animations.queue = new Array();
        this.animations.current = null;
        this.animations.default = null;
        this.animations.checkpoint = null;
        this.animations.modifiers = new Object();
        this.animations.modifiers.speed = 1;
        this.animations.modifiers.scaling = 1;

        this.text = new Array();

        this.filters = {
            brightness: { name: 'brightness', suffix: '%',   base: 100, target: 100, value: 100, ms: 0, duration: 0 },
            opacity:    { name: 'opacity',    suffix: '%',   base: 100, target: 100, value: 100, ms: 0, duration: 0 },
            invert:     { name: 'invert',     suffix: '%',   base: 0,   target: 0,   value: 0,   ms: 0, duration: 0 },
            hue:        { name: 'hue-rotate', suffix: 'deg', base: 0,   target: 0,   value: 0,   ms: 0, duration: 0 }
        };
    }

    // -----------------------
    // Initializing
    // -----------------------------

    initialize(location) {
        this.location = location;
        this.energy = 0;
        this.traveled.last = 0;
        this.traveled.total = 0;
        this.usedSkill = false;
        this.usedAttack = false;
        this.animations.default = BeastLogic.getDefaultAnimation(this);
        this.animations.current = this.animations.default;
        this.animations.queue = new Array();
        this.animations.checkpoint = null;
        this.animations.modifiers = new Object();
        this.animations.modifiers.speed = 1;
        this.animations.modifiers.scaling = 1;

        this.reset();
    }

    reset() {
        this.stats.current = { ...this.stats.max };
        this.stats.current.tp = 0;

        this.effects.poison = false;
        this.effects.haste = false;
        this.effects.slow = false;
        this.effects.berserk = false;
        this.effects.regen = false;
    }

    resetTurn() {
        this.energy = 0;
        this.traveled.last = 0;
        this.traveled.total = 0;
        this.usedSkill = false;
        this.usedAttack = false;
        this.animations.checkpoint = null;
    }

    // -----------------------
    // Animations
    // -----------------------------

    animate(animations, force = false) {
        this.animations.queue = GeneralLogic.toArray(animations);
        this.animations.current.terminate = force;
    }

    changeOrientation(orientation) {
        if (this.orientation === orientation)
            return;
        
        this.orientation = orientation;
        
        const animation = BeastLogic.getAnimation(this, this.animations.current.id, orientation, this.animations.current);
        animation.frame = this.animations.current.frame;
        this.animate(animation, true);
    }

    // -----------------------
    // Turn State
    // -----------------------------

    getRemainingMovement() {
        return this.stats.current.move - this.traveled.total;
    }

    canSwim() {
        return false;
    }

    canFly() {
        return false;
    }

    canMove() {
        return this.getRemainingMovement() > 0;
    }

    canAttack() {
        return !this.usedAttack;
    }

    canUseSkill(skill) {
        const hasTP = skill.tp <= this.stats.current.tp;
        return !this.usedSkill && hasTP;
    }

    isAlive() {
        return this.stats.current.health > 0;
    }

    doDamage(amount, fontSize = 30) {
        this.text.push({
            text: amount,
            fontSize: fontSize,
            duration: 750,
            ms: 0,
            ox: 0,
            oy: 0,
            initial: {
                x: 0,
                y: 0
            },
            target: {
                x: 0,
                y: -20
            }
        });
    }
}