class Scene {
    constructor(config) {
        this.map = Data.getMap(config.map);

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
        this.map.layout.forEach(row => {
            row.forEach(location => {
                this.map.render(delta, location);
            });
        });
    }
}