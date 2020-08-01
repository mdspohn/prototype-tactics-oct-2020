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
            headgear: null,
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

    set(type, equipment) {
        this.equipment[type] = equipment;
        this._addBonuses(equipment);
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

    render(ctx, layer, index, mirrored, x, y) {
        Object.values(this.equipment).forEach(item => {
            if (item === null)
                return;
            
            const META = item.meta[index]?.[~~mirrored];
            if (META === undefined || META.layer !== layer)
                return;

            ctx.save();
            ctx.translate(x + ~~META.ox + (~~META.mirrored * item.tw), y + ~~META.oy);
    
            if (META.mirrored)
                ctx.scale(-1, 1);

            ctx.drawImage(
                item.tileset,
                (META.idx * item.tw) % item.tileset.width,
                Math.floor((META.idx * item.tw) / item.tileset.width) * (item.th),
                item.tw,
                item.th,
                0,
                0,
                item.tw,
                item.th 
            );
            ctx.restore();
        });
    }
}