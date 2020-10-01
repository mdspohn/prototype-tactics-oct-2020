class GeneralLogic {
    static toArray(arg) {
        return (arg === undefined) ? [] : Array.isArray(arg) ? arg : [arg];
    }
}