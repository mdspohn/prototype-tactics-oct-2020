class Skill {
    constructor(config) {

        // --------------------
        // RANGE
        // ------------------------------

        this.range = new Object();
        this.range.min = ~~config.range?.min;
        this.range.max = config.range?.max;
        this.range.z = config.range?.z;
        this.range.pattern = config.range.pattern;

        // --------------------
        // TARGET
        // ------------------------------

        this.target = new Object();
        this.target.min = ~~config.target?.min;
        this.target.max = config.target?.max;
        this.target.z = config.target?.z;
        this.target.pattern = config.target.pattern;

        // ------------------------
        // SEQUENCE
        // -----------------------------

        this.sequence = config.sequence;

        // --------------------
        // DAMAGE MODIFIERS [% damage modifier from stats] <Integer>
        // ------------------------------

        this.power = ~~config.power; // base damage/healing number

        this.modifiers = new Object();
        this.modifiers.attack  = ~~config.modifiers?.attack  / 100;
        this.modifiers.defense = ~~config.modifiers?.defense / 100;
        this.modifiers.magic   = ~~config.modifiers?.magic   / 100;
        this.modifiers.resist  = ~~config.modifiers?.resist  / 100;

        this.modifiers.strength     = ~~config.modifiers?.strength     / 100;
        this.modifiers.dexterity    = ~~config.modifiers?.dexterity    / 100;
        this.modifiers.intelligence = ~~config.modifiers?.intelligence / 100;
        this.modifiers.mind         = ~~config.modifiers?.mind         / 100;
        this.modifiers.vitality     = ~~config.modifiers?.vitality     / 100;

        // --------------------
        // BUFFS [% chance of buff] <Integer>
        // ------------------------------

        this.buffs = new Object();
        this.buffs.regen = ~~config.buffs?.regen / 100;
        this.buffs.haste = ~~config.buffs?.haste / 100;

        // --------------------
        // DEBUFFS [% chance of debuff] <Integer>
        // ------------------------------

        this.debuffs = new Object();
        this.debuffs.poison = ~~config.debuffs?.poison / 100;
        this.debuffs.slow   = ~~config.debuffs?.slow   / 100;
    }
}