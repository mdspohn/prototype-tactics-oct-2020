class DataManager {
    constructor() {
        this.maps    = [];
        this.beasts  = [];
    }

    loadGameData() {
        // TODO: find through json data
        return new Promise((resolve, reject) => {
            this._initializeGameData().then(() => resolve());
        });
    }

    _initializeGameData() {
        return new Promise((resolve, reject) => {
            this.maps   = GAME_DATA.maps.map(opts => new Map(opts));
            this.beasts = GAME_DATA.beasts.map(opts => new Beast(opts));
            resolve();
        });
    }

    _initializeSaveData() {
        return new Promise.resolve();
    }
}

// -------------------------
// Maps
// -------------------------

DataManager.prototype.getMap = function(id, config) {
    return this._getMapTemplate(id).clone(config);
};

DataManager.prototype._getMapTemplate = function(id) {
    return this.maps.find(map => map.id == id);
};

// -------------------------
// Beasts
// -------------------------

DataManager.prototype._getBeastTemplate = function(id) {
    return this.beasts.find(beast => beast.id == id);
};

DataManager.prototype.getBeast = function(id, config) {
    return this._getBeastTemplate(id).clone(config);
};

DataManager.prototype.getRandomBeast = function(idArray, config) {
    const id = idArray[Math.floor(Math.random() * idArray.length)];
    return this._getBeastTemplate(id).clone(config);
};
