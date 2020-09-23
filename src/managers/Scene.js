class SceneManager {
    constructor() {
        this.data = null;
    }
    
    load() {
        this.data = GAME_DATA.scenes;
        return Promise.resolve();
    }

    get(id) {
        return new Scene(this.data[id]);
    }
}