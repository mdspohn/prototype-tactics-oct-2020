class Map {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;
        this.layout = config.layout;
        this.spawns = config.spawns;
        this.tileConfig = config.tileConfig;
        this.decorationData = config.decorationData;

        this.sortingType = 'x';
    }
}

Map.prototype.sortBy = function(type) {
    this.sortingType = type;
}

Map.prototype.getSorted = function() {
    return this.sorted[this.sortingType];
}

Map.prototype.clone = function(opts = {}) {
    return Object.assign(new Map(this), opts);
};

Map.prototype.initialize = function() {
    const w = this.tileConfig.width,
          h = this.tileConfig.height,
          d = this.tileConfig.depth;
    
    this.layout = this.layout.map((row, rowIndex) => {
        return row.map((column, columnIndex) => {
            const location = new Object();
            location.x = rowIndex;
            location.y = columnIndex;
            location.z = column.length;
            location.posX = (columnIndex * (w / 2)) - (rowIndex * (w / 2));
            location.posY = (columnIndex * (d / 2)) + (rowIndex * (d / 2)) - ((column.length - 1) * h);
            location.tiles = column;
            //location.spawn = !!this.spawns[rowIndex][columnIndex];
            location.sortIndex = rowIndex + columnIndex;
            return location;
        });
    });

    this.sorted = new Object();
    this.sorted.x = this.layout.reduce((acc, val) => acc.concat(val), []).sort((a, b) => {
        const sign = Math.sign(a.x - b.x);
        return (sign !== 0) ? sign : Math.sign(a.y - b.y);
    });
    this.sorted.y = this.layout.reduce((acc, val) => acc.concat(val), []).sort((a, b) => {
        const sign = Math.sign(a.y - b.y);
        return (sign !== 0) ? sign : Math.sign(a.x - b.x);
    });

    this.decoration = new Decoration(this.decorationData);

    return new Promise((resolve, reject) => {
        this.img = new Image();
        this.img.onload = () => this.decoration.initialize().then(() => resolve());
        this.img.src = 'assets/stages/' + this.tileConfig.src;
    });
};

Map.prototype.update = function(step) {
};

Map.prototype.render = function(delta, location) {
    const w = this.tileConfig.width,
          h = this.tileConfig.height,
          d = this.tileConfig.depth,
          x = Game.camera.position.x - ((location.x - location.y + 1) * (w / 2)),
          y = Game.camera.position.y + ((location.x + location.y) * (d / 2));

    location.tiles.forEach((id, index) => {
        Game.ctx.save();
        Game.ctx.translate(x, y - (index * h));
        Game.ctx.drawImage(this.img, (id * w), 0, w, (h + d), 0, 0, w, (h + d));
        Game.ctx.restore();
    });

    return { w, h, d, x, y };
};

Map.prototype.renderDecoration = function(delta, location, translate) {
    this.decoration.render(delta, location, translate);
};