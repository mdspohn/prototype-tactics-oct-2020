class Scene {
    constructor(config) {
        this.map = Data.getMap(config.map);
        // this.decoration = Data.getDecoration(config.decoration);
        // this.objects = Data.getObjects(config.objects);

        this.entities = new Object();
        this.entities.ally = new Array();
        this.entities.neutral = new Array();
        this.entities.enemy = new Array();
    }

    async load() {
        await this.map.load();
    }

    update(step) {
        this.map.update(step);
    }

    render(delta) {
        this.map.structure.forEach(location => {
            this.map.render(delta, location);
            // this.map.decorations.render(delta, location);
            // this.map.objects.render(delta, location);
            // this.entities.ally.forEach(entity => entity.render(delta, location));
            // this.entities.neutral.forEach(entity => entity.render(delta, location));
            // this.entities.enemy.forEach(entity => entity.render(delta, location));
        });
    }
}