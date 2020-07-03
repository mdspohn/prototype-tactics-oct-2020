class SceneLoader {
    constructor() {
        this.type = null;
        this.map = null;
        this.decoration = null;
        this.entities = new Array();
        this.assets = new Object();
    }

    async _load(id) {
        const scene = Data.getScene(id);
        
        // configure scene objects
        this.type = scene.type;
        this.map = new Map(Data.getMap(scene.map));
        this.decoration = new Decoration(Data.getDecoration(scene.decoration));
        this.entities = [...Data.getRoster(), ...scene.entities].map(opts => {
            const config = Object.assign(Data.getBeast(opts.id), opts);
            return new Beast(config);
        });

        // load missing tilesets
        return Promise.all([
            this.map._prepare(this.assets),
            this.decoration._prepare(this.assets),
            this.entities.forEach(entity => entity._prepare(this.assets))
        ]);
    }
}