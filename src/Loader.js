class SceneLoader {
    constructor() {
        this.type = null; // controller type for loaded scene
        this.map = null;
        this.entities = null;
        this.layout = null;
    }

    async _load(sceneId) {
        const scene   = Data.getScene(sceneId),
              roster  = Data.getRoster(),
              mapData = Data.getMap(scene.map);
        
        this.type = scene.type;
        this.map = new Map(mapData);
        this.entities = [...roster, ...scene.entities].map(entityData => new Beast(entityData));
        this.layout = new Layout(this.map, this.entities);

        return Promise.all([ this.map._prepare(), this.entities.forEach(entity => entity._prepare()) ]);
    }
}