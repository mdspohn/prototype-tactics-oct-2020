class DataManager {
    constructor() {

        // furthest story mission completion
        this.progress = 0;

        // data of all available beasts in stables
        this.roster = [];

        // id of beasts selected for active party
        this.party = [];

    }

    getScene(id) {
        return GAME_DATA.scenes.find(scene => scene.id == id);
    }

    getMap(id) {
        return new Map(GAME_DATA.maps.find(map => map.id == id));
    }

    getTileset(id) {
        return new Tileset(GAME_DATA.tilesets.find(tileset => tileset.id == id));
    }

    getBeast(id) {
        return new Beast(GAME_DATA.beasts.find(beast => beast.id == id));
    }
}