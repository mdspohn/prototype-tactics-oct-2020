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
        let needsLoading = new Array();
        Object.entries(this.tilesets).forEach(([category, configurations]) => {
            this.assets[category] = new Object();
            Object.entries(configurations).forEach(([type, data]) => {
                this.assets[category][type] = new Tileset(category, data);
                needsLoading.push(this.assets[category][type]);
            });
        });

        return Promise.all([...needsLoading.map(tileset => tileset._load())]);
        //return Promise.all([...Object.values(this.assets).map(category => Object.values(category).map(tileset => tileset._load()))]);
    }

    getRoster() {
        return this.roster;
    }

    getEquipment(id) {
        return new Equipment(this.equipment[id], this.assets.equipment[this.equipment[id].tileset])
    }

    getBeast(id, opts) {
        const entity = new Beast(Object.assign(this.beasts[id], opts), this.assets.beasts[this.beasts[id].tileset]);
        if (opts.equipment !== undefined)
            Object.entries(opts.equipment).forEach(([ type, id ]) => entity.equipment.set(type, this.getEquipment(id)));

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