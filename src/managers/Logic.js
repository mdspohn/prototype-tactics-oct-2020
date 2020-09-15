class LogicManager {
    constructor() {
        this.general = new GeneralLogic();
        this.range = new RangeLogic();
        this.pathing = new MovementLogic();
        this.turns = new TurnLogic();
    }
}