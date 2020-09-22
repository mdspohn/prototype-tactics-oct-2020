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
        this.range.min = config.range.min;
        this.range.max = config.range.max;
        this.range.z = config.range.z;
        this.range.pattern = config.range.pattern;

        this.selection = new Object();
        this.selection.min = config.selection.min;
        this.selection.max = config.selection.max;
        this.selection.z = config.selection.z;
        this.selection.pattern = config.selection.pattern;

        this.targetList = config.targetList; // [enemy, ally, neutral, tile] - valid targets when confirming skill
        this.hasMovement = Boolean(config.hasMovement); // involves moving attacker
        this.isTeleport = Boolean(config.isTeleport); // animates directly from start tile to finish tiles with no path
        this.moveTo = config.moveTo; // target, before-target - location to move attacker to
        this.blockerList = config.blockerList; // [enemy, ally, neutral, hazard] - things that prevent range from going any further

        // ------------------------
        // Skill Event Sequence
        // -----------------------------

        this.sequence = config.sequence;
    }
}