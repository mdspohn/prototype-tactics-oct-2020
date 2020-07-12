class SceneLoader {
    constructor() {
        this.type = null;
        this.map = null;
        this.decoration = null;
        this.entities = new Array();
        this.tilesets = new Object();
    }

    async _prepare(id) {
        const scene = Data.getScene(id),
              area = Data.getArea(scene.area);
        
        // configure scene objects
        this.type = scene.type;
        this.map = new Map(area.map);
        this.decoration = new Decoration(area.decoration);
        this.entities = [...Data.getRoster(), ...scene.entities].map(opts => {
            const config = Object.assign(Data.getBeast(opts.id), opts);
            return new Beast(config);
        });

        // load missing tilesets
        return Promise.all([
            this.map._prepare(this.tilesets),
            this.decoration._prepare(this.tilesets),
            this.entities.forEach(entity => entity._prepare(this.tilesets))
        ]);
    }
}