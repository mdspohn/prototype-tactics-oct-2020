class DataManager {
    constructor() {
        // TODO
    }

    getScene(id) {
        return new Scene(GAME_DATA.scenes.find(scene => scene.id == id));
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