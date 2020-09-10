class AnimationRenderer2D {
    constructor(config = {}) {
        this.speed = (config.speed !== undefined) ? config.speed : 1;
    }

    setAnimationSpeed(speed = 1) {
        this.speed = speed;
    }

    getAnimationSpeed() {
        return this.speed;
    }
}