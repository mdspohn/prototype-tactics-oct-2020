class Decoration {
    constructor(config) {
        this.tiles  = config.tiles;
        this.chance = config.chance;
        this.tileConfig = config.tileConfig;
    }
}

Decoration.prototype.initialize = function() {
    this.layout = this.chance.map((row, ri) => {
        return row.map((probability, ci) => {
            if (probability > (Math.random() * 100)) {
                const choices = [].concat(this.tiles[ri][ci]);
                return choices[Math.floor(Math.random() * choices.length)];
            }
        });
    });

    return new Promise((resolve) => {
        this.img = new Image();
        this.img.onload = () => resolve();
        this.img.src = 'assets/decorations/' + this.tileConfig.src;
    });
};

Decoration.prototype.update = function(step) {
    // animation stuff
};

Decoration.prototype.render = function(delta, location, translate) {
    if (!this.layout[location.x] || !this.layout[location.x][location.y])
        return;
    
    const w = this.tileConfig.width,
          h = this.tileConfig.height;

    Game.ctx.save();
    Game.ctx.translate(translate.x, translate.y - (location.z * translate.h) + (24 - h));
    Game.ctx.drawImage(this.img, (this.layout[location.x][location.y] * w), 0, w, h, 0, 0, w, h);
    Game.ctx.restore();
};