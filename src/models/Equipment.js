class Equipment {
    constructor(data, tileset) {

        // ----------------------
        // STATS
        // ----------------------------

        this.health  = ~~data.health;
        this.attack  = ~~data.attack;
        this.defense = ~~data.defense;
        this.spirit  = ~~data.spirit;
        this.resist  = ~~data.resist;

        this.tp = ~~data.tp;

        this.block   = ~~data.block;
        this.evasion = ~~data.evasion;

        this.move  = ~~data.move;
        this.jump  = ~~data.jump;
        this.speed = ~~data.speed;

        // ----------------------
        // ANIMATIONS
        // ---------------------------

        this.tileset = tileset.img;

        // tile dimensions
        this.tw = tileset.tw;
        this.td = tileset.td;
        this.th = tileset.th;

        // tile animation data
        this.meta = tileset.config;
    }
}

class EquipmentManager {
    constructor() {
        this.equipment = {
            weapon: null,
            helmet: null,
            armor: null,
            accessory_1: null,
            accessory_2: null,
            anima_1: null,
            anima_2: null,
            anima_3: null
        };

        // ---------------
        // TOTAL EQUIPMENT BONUSES
        // ---------------------------

        this.health  = 0;
        this.attack  = 0;
        this.defense = 0;
        this.spirit  = 0;
        this.resist  = 0;

        this.tp = 0;

        this.block   = 0;
        this.evasion = 0;

        this.move  = 0;
        this.jump  = 0;
        this.speed = 0;

        // TODO
        this.immunities = [];
    }

    set(type, data, tileset) {
        console.log(type, data, tileset)
        this.equipment[type] = new Equipment(data, tileset);
        this._addBonuses(this.equipment[type]);
    }

    remove(type) {
        this._removeBonuses(this.equipment[type]);
        this.equipment[type] = null;
    }

    _addBonuses(equipment) {
        this.health  += ~~equipment.health;
        this.attack  += ~~equipment.attack;
        this.defense += ~~equipment.defense;
        this.spirit  += ~~equipment.spirit;
        this.resist  += ~~equipment.resist;

        this.tp += ~~equipment.tp;

        this.block   += ~~equipment.block;
        this.evasion += ~~equipment.evasion;

        this.move  += ~~equipment.move;
        this.jump  += ~~equipment.jump;
        this.speed += ~~equipment.speed;
    }

    _removeBonuses(equipment) {
        this.health  -= ~~equipment.health;
        this.attack  -= ~~equipment.attack;
        this.defense -= ~~equipment.defense;
        this.spirit  -= ~~equipment.spirit;
        this.resist  -= ~~equipment.resist;

        this.tp -= ~~equipment.tp;

        this.block   -= ~~equipment.block;
        this.evasion -= ~~equipment.evasion;

        this.move  -= ~~equipment.move;
        this.jump  -= ~~equipment.jump;
        this.speed -= ~~equipment.speed;
    }

    render(layer, animation, x, y) {
        Object.values(this.equipment).forEach(item => {
            if (item === null || item.meta[animation.id] === undefined || item.meta[animation.id].layer !== layer)
                return;

            const FRAME_META = item.meta[animation.id].frames[animation.frame];

            Game.ctx.save();
            Game.ctx.translate(x + ~~item.meta[animation.id].ox, y + ~~item.meta[animation.id].oy);
            Game.ctx.drawImage(
                item.tileset,
                (FRAME_META.idx * item.tw) % item.tileset.width,
                Math.floor((FRAME_META.idx * item.tw) / item.tileset.width) * (item.th),
                item.tw,
                item.th,
                ~~FRAME_META.ox,
                ~~FRAME_META.oy,
                item.tw,
                item.th 
            );
            Game.ctx.restore();
        });
    }
}