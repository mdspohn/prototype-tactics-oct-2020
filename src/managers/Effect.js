class EffectManager {
    constructor({ speed, scaling } = settings) {
        this.speed = speed;
        this.scaling = scaling;

        this.effects = new Object();
        this.effects.tile = new Array();
        this.effects.screen = new Array();
    }

    filter(fn) {
        return this.effects.tile.filter(fn);
    }

    getEffects() {
        return [...this.effects.tile, ...this.effects.screen];
    }

    getTileEffects() {
        return this.effects.tile;
    }

    getScreenEffects() {
        return this.effects.screen;
    }
}