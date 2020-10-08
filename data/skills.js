// -----------------------
// BASIC ATTACKS
// ---------------------------


GAME_DATA.skills['spear'] = {
    name: 'Spear Attack',
    description: '...',
    range: {
        min: 1,
        max: 2,
        pattern: 'CARDINAL',
        z: 2
    },
    selection: {
        min: 0,
        max: 1,
        pattern: 'CONCURRENT',
        z: 2
    }
};

GAME_DATA.skills['bow'] = {
    name: 'Bow Attack',
    description: '...',
    range: {
        min: 3,
        max: 6,
        pattern: 'POINT',
        z: 3
    },
    selection: {
        min: 0,
        max: 0,
        pattern: 'POINT'
    }
};

// -----------------------
// TP-COST SKILLS
// ---------------------------
GAME_DATA.skills['slash'] = {
    name: 'Melee Attack',
    description: '...',
    range: {
        min: 1,
        max: 1,
        pattern: 'POINT',
        z: 2
    },
    selection: {
        min: 0,
        max: 0,
        pattern: 'POINT',
        z: 2
    },
    sequence: [
        {
            type: 'animation',
            unit: 'attacker',
            id: 'slash',
            await: 'hit'
        },
        {
            type: 'animation',
            unit: 'defender',
            id: 'hit'
        },
        {
            type: 'damage',
            unit: 'defender',
            amount: 22,
            fontSize: 30
        },
        {
            type: 'filter',
            unit: 'defender',
            filters: [
                {
                    type: 'brightness',
                    initial: 100,
                    target: 0,
                    suffix: '%',
                    duration: 150,
                    reverse: true
                },
                {
                    type: 'invert',
                    initial: 0,
                    target: 100,
                    suffix: '%',
                    duration: 150,
                    reverse: true
                }
            ],
            await: 'brightness-filter-complete'
        }
    ]
};

GAME_DATA.skills['double-slash'] = {
    name: 'Melee Attack',
    description: '...',
    range: {
        min: 1,
        max: 1,
        pattern: 'POINT',
        z: 2
    },
    selection: {
        min: 0,
        max: 0,
        pattern: 'POINT',
        z: 2
    },
    sequence: [
        {
            type: 'animation',
            unit: 'attacker',
            id: 'slash',
            await: 'hit'
        },
        {
            type: 'animation',
            unit: 'defender',
            id: 'hit'
        },
        {
            type: 'damage',
            unit: 'defender',
            amount: 22,
            fontSize: 30
        },
        {
            type: 'filter',
            unit: 'defender',
            filters: [
                {
                    type: 'brightness',
                    initial: 100,
                    target: 0,
                    suffix: '%',
                    duration: 150,
                    reverse: true
                },
                {
                    type: 'invert',
                    initial: 0,
                    target: 100,
                    suffix: '%',
                    duration: 150,
                    reverse: true
                }
            ],
            await: 'brightness-filter-complete'
        },
        {
            type: 'animation',
            unit: 'attacker',
            id: 'slash-reverse',
            await: 'hit'
        },
        {
            type: 'animation',
            unit: 'defender',
            //movement: true,
            location: 'knockback',
            id: 'hit'
        },
        {
            type: 'damage',
            unit: 'defender',
            amount: 33,
            fontSize: 40
        },
        {
            type: 'filter',
            unit: 'defender',
            filters: [
                {
                    type: 'brightness',
                    initial: 100,
                    target: 0,
                    suffix: '%',
                    duration: 200,
                    reverse: true
                },
                {
                    type: 'invert',
                    initial: 0,
                    target: 100,
                    suffix: '%',
                    duration: 200,
                    reverse: true
                }
            ],
            await: 'brightness-filter-complete'
        }
        // {
        //     type: 'damage',
        //     actor: 'defender',
        //     percentage: 100
        // }

    ]
};

GAME_DATA.skills['flicker'] = {
    name: 'Flicker Strike',
    description: '...',
    range:     { min: 1, max: 10, pattern: 'CARDINAL', z: 0 },
    selection: { min: 0, max: 0, pattern: 'POINT',    z: 0 },
    canTarget: 'enemy', // ['ally', 'neutral', 'foe', 'entity', 'tile']
    hasMovement: true, // show movement markers for this skill
    isTeleport: false,
    blockedBy: ['ally', 'neutral', 'foe', 'hazard'],
    moveTo: 'before-target', // where movement markers will point to ['target', 'before-target']
    sequence: [
        // {
        //     type: 'animation',
        //     unit: 'attacker',
        //     id: 'brace'
        // },
        {
            type: 'effect',
            category: 'tile',
            location: 'origin',
            id: 'crackle',
            z: 1,
            await: 'crackle-complete'
        },
        {
            type: 'effect',
            category: 'tile',
            location: 'origin',
            id: 'dust',
            z: -1
        },
        {
            type: 'animation',
            unit: 'attacker',
            id: 'dash',
            movement: true,
            location: 'before-target',
            await: 'move-complete'
        },
        {
            type: 'animation',
            unit: 'attacker',
            id: 'punch',
            await: 'hit'
        },
        {
            type: 'animation',
            unit: 'defender',
            movement: true,
            location: 'knockback',
            id: 'hit'
        },
        // {
        //     type: 'effect',
        //     category: 'text',
        //     subcategory: 'damage',
        //     unit: 'defender',
        //     percent: 25
        // },
        // {
        //     type: 'wait',
        //     ms: 1000
        // },
        // {
        //     type: 'effect',
        //     category: 'map',
        //     location: 'target',
        //     id: 'lightning',
        //     await: 'lightning-strike'
        // },
        // {
        //     type: 'camera',
        //     id: 'shake'
        // },
        // {
        //     type: 'effect',
        //     category: 'screen',
        //     id: 'flash',
        //     await: 'lightning-complete'
        // },
        // {
        //     type: 'effect',
        //     category: 'text',
        //     subcategory: 'damage',
        //     unit: 'defender',
        //     percent: 75
        // },
        // {
        //     type: 'effect',
        //     category: 'text',
        //     subcategory: 'status',
        //     unit: 'defender'
        // }
    ]
};

GAME_DATA.skills['magic'] = {
    name: 'Magic AoE Attack',
    description: '...',
    range: {
        min: 0,
        max: 5,
        pattern: 'POINT',
        z: null
    },
    selection: {
        min: 0,
        max: 1,
        pattern: 'POINT',
        z: 2
    }
};

GAME_DATA.skills['earthquake'] = {
    name: 'Earthquake',
    description: '...',
    range: {
        min: 0,
        max: null,
        pattern: 'ENTITIES',
        z: null
    },
    selection: {
        min: 0,
        max: null,
        pattern: 'ENTITIES',
        z: 2
    }
};