class SkillLogic {

    static getRange(skill, location, scene) {
        return PathingLogic.getRange(scene, {
            location,
            min: ~~skill.range.min,
            max: skill.range.max,
            zUp: skill.range.zu,
            zDown: skill.range.zd,
            selectableHazards: true,
            continueOnHazards: true,
            selectableEntities: true,
            continueOnEntities: true,
            orientationLock: skill.range.selection === 'cardinal'
        });
    }

    static getSelection(skill, location, scene, restrictions) {
        return PathingLogic.getRange(scene, {
            location,
            min: ~~skill.target.min,
            max: skill.target.max,
            zUp: skill.target.zu,
            zDown: skill.target.zd,
            selectableHazards: true,
            continueOnHazards: true,
            selectableEntities: true,
            continueOnEntities: true,
            orientationLock: skill.target.selection === 'cardinal',
            restrictedRange: skill.target.overflow ? undefined : restrictions
        }, new WeakMap(), new Array());
    }
}