class Area {
    constructor(config) {
        // textual data and identifiers
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;

        // data and rendering
        this.map = null;
        this.decorations = null;
        this.objects = null;
        this.events = null;
        this.entities = null;
    }

    async _initMap(id) {
        this.map = new Map(id);
        return this.map.initialize();
    }

    async _initDecorations(id) {

    }

    async _initObjects(config) {

    }

    async _initEvents(config) {

    }

    async _initEntities(config) {

    }

    async initialize(map, decorations, objects, events, entities) {
        return Promise.all([
            this._initMap(map),
            this._initDecorations(decorations),
            this._initObjects(objects),
            this._initEvents(events),
            this._initEntities(entities)
        ])
    }
}

Map.prototype.update = function(step) {
    this.map.update(step);
    this.decorations.update(step);
    this.objects.update(step);
    this.events.update(step);
    this.entities.update(step);
}

Map.prototype.renderTile = function(canvas, delta, x, y) {
    this.map.render(canvas, delta, x, y);
    this.decorations.render(canvas, delta, x, y);
    this.objects.render(canvas, delta, x, y);
    this.events.render(canvas, delta, x, y);
    this.entities.render(canvas, delta, x, y);
}
