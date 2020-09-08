class SkillManager {
    constructor() {
        this.skills = new Object();
    }

    async _load() {
        Object.entries(GAME_DATA.skills).forEach(([id, config]) => this.skills[id] = new Skill(config));
    }

    addSkill(beast, id) {
        const action = this.skills[id];
        if (action === undefined)
            return console.warn('Skill not found: ', id);

        beast.actions.skills.push(action);
        // XXX - Remove
        console.log(beast.id + ' >> [' + id + '] <Skill>');
    }

    removeSkill(beast, id) {
        const index = beast.skills.findIndex(skill => skill.id == id);
        beast.actions.skills.splice(index, 1);
    }

    setSkills(beast, ids) {
        beast.actions.skills = new Array();
        ids.forEach(id => this.addSkill(beast, id));
    }

    setAttack(beast, id) {
        const action = this.skills[id];
        if (action === undefined)
            return console.warn('Attack not found: ', id);

        beast.actions.basic = action;
        // XXX - Remove
        console.log(beast.id + ' >> [' + id + '] <Basic Attack>');
    }
}