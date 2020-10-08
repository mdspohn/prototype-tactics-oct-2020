class SkillManager {
    constructor() {
        this.data = null;
    }

    load() {
        this.data = GAME_DATA.skills;

        return Promise.resolve();
    }

    save() {

    }

    get(id, opts = {}) {
        return this.data[id];
    }
}