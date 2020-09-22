class EffectFactory {

    static getEffect(config) {
        const effect = new Object();
        effect.ms = 0;
        effect.frame = 0;
        effect.config = new Array();
        effect.tileset = Assets.getTileset('effects', config.id);

        return effect;
    }
}