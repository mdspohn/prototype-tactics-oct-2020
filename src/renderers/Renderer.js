class Renderer {
    constructor(settings) {
        this.speed = settings.speed;
        this.scaling = settings.scaling;
    }

    // ----------------------
    // Settings
    // ----------------------------

    getSpeed() {
        return this.speed;
    }

    getScaling() {
        return this.scaling;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setScaling(scaling) {
        this.scaling = scaling;
    }
}