class MapManager {
    constructor() {
        this.data = null;
        this.tilesets = null;
        this.assets = new Object();
    }

    load() {
        this.data = GAME_DATA.maps;
        this.tilesets = GAME_DATA.tilesets.maps;

        Object.entries(this.tilesets).forEach(tileset => {
            this.assets[tileset[0]] = new Tileset('maps', tileset[1]);
        });

        return Promise.all([...Object.values(this.assets).map(tileset => tileset.load())]);
    }

    save() {

    }

    get(id, opts = {}) {
        const configuration = Object.assign(this.data[id], opts),
              asset = this.assets[this.data[id].tileset];

        return new Map(configuration, asset);
    }
}