class DataManager {
    constructor() {
        this.roster = [];
    }

    getRoster() {
        return this.roster;
    }

    getScene(id) {
        return GAME_DATA.scenes[id];
    }

    getMap(id) {
        return GAME_DATA.maps[id];
    }

    getTileset(id) {
        return GAME_DATA.tilesets[id];
    }

    getBeast(id) {
        return GAME_DATA.beasts[id];
    }
}