class LogicManager {
    constructor() {
        this.general = new GeneralLogic();
        this.range = new RangeLogic();
        this.pathing = new PathingLogic();
        this.turns = new TurnLogic();
    }
}