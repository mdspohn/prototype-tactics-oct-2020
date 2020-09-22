class EffectFactory {

    static createTileEffect(id, location, z) {
        const effect = new Object();
        effect.ms = 0;
        effect.frame = 0;
        effect.config = new Array();
        effect.location = location;
        effect.z = z;

        if (type === 'sprite')
            EffectFactory._addTileset(effect, 'tile');

        return effect;
    }

    static createTextEffect(text, color, size, location) {

    }

    static createProjectileEffect(id, arcFn, location, destination) {

    }

    static createMapEffect(id, type, location) {
        const effect = new Object();
        effect.ms = 0;
        effect.frame = 0;
        effect.config = new Array();
        effect.location = location;

        if (type === 'sprite')
            EffectFactory._addTileset(effect, 'map');

        return effect;
    }

    static createScreenEffect(config) {

    }

    static _addTileset(effect, id) {
        effect.tileset = Assets.getTileset('effects', id);
    }
}