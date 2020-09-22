class Skill {
    constructor(config) {

        // --------------------
        // General
        // ------------------------------

        this.id = config.id;
        this.name = config.name;
        this.description = config.description;

        // --------------------
        // Range / Selection
        // ------------------------------

        this.range = new Object();
        this.range.min = ~~config.range?.min;
        this.range.max = config.range?.max;
        this.range.z = config.range?.z;
        this.range.pattern = config.range.pattern;

        this.target = new Object();
        this.target.min = ~~config.target?.min;
        this.target.max = config.target?.max;
        this.target.z = config.target?.z;
        this.target.pattern = config.target.pattern;

        // ------------------------
        // Skill Event Sequence
        // -----------------------------

        this.sequence = config.sequence;
    }
}