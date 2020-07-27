class DataManager {
    constructor() {

        // ---------------
        // SAVE DATA
        // ------------------

        this.roster = [];
        this.inventory = [];

        // ---------------
        // META DATA AND ASSETS
        // ------------------

        this.scenes    = GAME_DATA.scenes;
        this.areas     = GAME_DATA.areas;
        this.beasts    = GAME_DATA.beasts;
        this.equipment = GAME_DATA.equipment;
        this.tilesets  = GAME_DATA.tilesets;

        this.assets = new Object();
    }

    async _load() {
        Object.entries(this.tilesets).forEach(([category, configurations]) => {
            this.assets[category] = new Object();
            Object.entries(configurations).forEach(([type, data]) => {
                this.assets[category][type] = new Tileset(category, data);
            });
        });

        return Promise.all([Object.values(this.assets).forEach(category => Object.values(category).forEach(tileset => tileset._load()))]);
    }

    getRoster() {
        return this.roster;
    }

    getBeast(id, opts) {
        const entity = new Beast(Object.assign(this.beasts[id], opts), this.assets.beasts[this.beasts[id].tileset]);

        if (!!opts.weapon)
            entity.equipment.set('weapon', this.equipment[opts.weapon], this.assets.equipment[this.equipment[opts.weapon].tileset]);
        if (!!opts.helmet)
            entity.equipment.set('helmet', this.equipment[opts.helmet], this.assets.equipment[this.equipment[opts.helmet].tileset]);
        if (!!opts.armor)
            entity.equipment.set('armor', this.equipment[opts.armor], this.assets.equipment[this.equipment[opts.armor].tileset]);
        if (!!opts.accessory_1)
            entity.equipment.set('accessory_1', this.equipment[opts.accessory_1], this.assets.equipment[this.equipment[opts.accessory_1].tileset]);
        if (!!opts.accessory_2)
            entity.equipment.set('accessory_2', this.equipment[opts.accessory_2], this.assets.equipment[this.equipment[opts.accessory_2].tileset]);

        return entity;
    }

    getScene(id) {
        const scene = GAME_DATA.scenes[id];

        if (scene === undefined)
            return console.error('Scene not found.', id);

        const area = GAME_DATA.areas[scene.area];

        return {
            type: scene.type,
            map: new Map(area.map, this.assets.maps[area.map.tileset]),
            decoration: new Decoration(area.decoration, this.assets.decorations[area.decoration.tileset]),
            entities: [...this.getRoster(), ...scene.entities].map(opts => this.getBeast(opts.id, opts))
        };
    }
}