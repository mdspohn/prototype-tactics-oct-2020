class Beast {
    constructor(config, tileset) {
        
        // ----------------------
        // General
        // ----------------------------

        this.id = config.id;
        this.name = config.name;
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

        this.equipment = new EquipmentManager();

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
        this.animations.checkpoint = null;
        this.animations.modifiers = new Object();
        this.animations.modifiers.speed = 1;
        this.animations.modifiers.scaling = 1;
        this.animations.modifiers.filter = null;

    }

    initialize(location) {
        this.location = location;
        this.energy = 0;
        this.traveled.last = 0;
        this.traveled.total = 0;
        this.usedSkill = false;
        this.usedAttack = false;
        this.animations.current = BeastLogic.getDefaultAnimation(this);
        this.animations.queue = new Array();
        this.animations.checkpoint = null;
        this.animations.modifiers = new Object();
        this.animations.modifiers.speed = 1;
        this.animations.modifiers.scaling = 1;
        this.animations.modifiers.filter = null;

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
        animations = Array.isArray(animations) ? animations : [animations];
        if (force)
            this.animations.current = animations.shift();

        this.animations.queue.push(...animations);
    }

    // -----------------------
    // Turn State
    // -----------------------------

    getRemainingMovement() {
        return this.stats.current.move - this.traveled.total;
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

    // -----------------------
    // Stat Accessors
    // -----------------------------

    damage(amount = 0) {
        this.stats.current.health -= amount;
        if (this.stats.current.health <= 0)
            Events.dispatch('death', this);
    }

    heal(amount = 0) {
        this.stats.current.health = Math.min(this.stats.max.health, this.stats.current.health + amount);
    }
}