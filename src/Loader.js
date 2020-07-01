class SceneLoader {
    constructor() {
        // controller type for loaded scene
        this.type = null;

        this.map = null;
        this.decoration = null;
        this.objects = [];

        this.allies  = [];
        this.neutral = [];
        this.enemies = [];
    }

    async _load(sceneId) {
        const scene = Data.getScene(sceneId);

        this.type = scene.type;
        this.map = Data.getMap(scene.map);

        return Promise.all([this.map.load()]);
    }
}