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

        this.attack = 'push';
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

        // this.animation = new Object();
        // this.animation.id = 'idle';
        // this.animation.orientation = 'south';
        // this.animation.ms = 0;
        // this.animation.delta = 0;

        // this.animation.next = new Array();
        // this.animation.next.push({
        //     id: 'move',
        //     orientation: 'east',
        //     destination: this.location,
        //     swap: 'move-step'
        // });

        // this.filters = new Object();
        // this.filters['brightness'] = {
        //     suffix: '%',
        //     ms: 0,
        //     delta: 0,
        //     duration: 0,
        //     current: 0,
        //     target: 0
        // };
        // this.filters['opacity'] = {
        //     suffix: '%',
        //     ms: 0,
        //     delta: 0,
        //     duration: 0,
        //     current: 0,
        //     target: 0
        // };
        // this.filters['hue-rotate'] = {
        //     suffix: 'deg',
        //     ms: 0,
        //     delta: 0,
        //     duration: 0,
        //     current: 0,
        //     target: 0
        // };

        this.animations = new Object();
        this.animations.queue = new Array();
        this.animations.current = null;
        this.animations.checkpoint = null;
        this.animations.modifiers = new Object();
        this.animations.modifiers.speed = 1;
        this.animations.modifiers.scaling = 1;

        this.text = new Array();
        this.filters = new Array();
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
        this.animations.current = BeastLogic.getDefaultAnimation(this);
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
        animations = Array.isArray(animations) ? animations : [animations];
        this.animations.queue.push(...animations);
        if (force)
            this.animations.current.terminate = true;
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