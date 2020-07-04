class DataManager {
    constructor() {
        // this class is just in charge of converting JSON data to javascript objects and saving changes back
        // as long as the methods return javascript objects when data is requested, nothing in the app changes
        this.mission = 0;
        this.roster = [];
    }

    getRoster() {
        return this.roster;
    }

    getScene(id) {
        return GAME_DATA.scenes[id];
    }

    getArea(id) {
        return GAME_DATA.areas[id];
    }

    getTileset(id, directory) {
        return Object.assign({ directory }, GAME_DATA.tilesets[directory][id]);
    }

    getBeast(id) {
        return GAME_DATA.beasts[id];
    }
}