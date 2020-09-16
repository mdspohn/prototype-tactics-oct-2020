class Equipment {
    constructor(data, tileset) {

        this.skillId = data.skill_id;

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

        this.tileset = tileset;

        // tile dimensions
        this.tw = tileset.tw;
        this.td = tileset.td;
        this.th = tileset.th;
    }

    getSkillId() {
        return this.skillId;
    }
}

class EquipmentManager {
    constructor() {
        this.equipment = {
            weapon: null,
            headgear: null,
            armor: null,
            accessory_1: null,
            accessory_2: null
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

    getWeaponSkillId() {
        if (this.equipment.weapon !== null)
            return this.equipment.weapon.getSkillId();
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
}