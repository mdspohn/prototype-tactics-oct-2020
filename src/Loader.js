class AssetLoader {
    constructor() {
        this.assets = new Object();

        this.data = new Object();
        this.data.scenes = GAME_DATA.scenes;
        this.data.areas = GAME_DATA.areas;
        this.data.beasts = GAME_DATA.beasts;
        this.data.equipment = GAME_DATA.equipment;
        this.data.skills = GAME_DATA.skills;

        this.sounds = null;
        this.tilesets = GAME_DATA.tilesets;
    }

    async _load() {
        const pending = [];

        Object.entries(this.tilesets).forEach(configurations => {
            this.assets[configurations[0]] = new Object();
            Object.entries(configurations[1]).forEach(config => {
                const asset = new Tileset(configurations[0], config[1]);
                pending.push(asset);
                this.assets[configurations[0]][config[0]] = asset;
            });
        });

        return Promise.all([...pending.map(asset => asset._load())]);
    }

    getTileset(category, id) {
        return this.assets[category][id];
    }

    getBeast(id, opts) {
        const entity = new Beast(Object.assign(this.data.beasts[id], opts), this.getTileset('beasts', this.data.beasts[id].tileset));
        if (opts.equipment !== undefined)
            Object.entries(opts.equipment).forEach(([ type, id ]) => entity.equipment.set(type, this.getEquipment(id)));

        return entity;
    }

    getSkill(id) {
        return new Skill(this.data.skills[id]);
    }

    getEquipment(id) {
        return new Equipment(this.data.equipment[id], this.getTileset('equipment', this.data.equipment[id].tileset));
    }

    getScene(id) {
        const scene = this.data.scenes[id];

        if (scene === undefined)
            return console.error('Scene not found.', id);

        const area = this.data.areas[scene.area];

        return {
            type: scene.type,
            map: new Map(area.map, this.getTileset('maps', area.map.tileset)),
            decoration: new Decoration(area.decoration,  this.getTileset('decorations', area.decoration.tileset)),
            entities: [...scene.entities].map(opts => this.getBeast(opts.id, opts))
        };
    }
}