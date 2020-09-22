// -----------------------
// BASIC ATTACKS
// ---------------------------

GAME_DATA.skills['sword'] = {
    name: 'Melee Attack',
    description: '...',
    range: {
        min: 1,
        max: 1,
        pattern: 'POINT',
        z: 2
    },
    target: {
        min: 0,
        max: 0,
        pattern: 'POINT',
        z: 2
    },
    sequence: [
        {
            type: 'animation',
            id: 'slash',
            actor: 'attacker',
            wait: 'hit'
        },
        {
            type: 'animation',
            id: 'hit',
            actor: 'defender'
        },
        {
            type: 'damage',
            actor: 'defender',
            percentage: 100
        }

    ]
};

GAME_DATA.skills['spear'] = {
    name: 'Spear Attack',
    description: '...',
    range: {
        min: 1,
        max: 2,
        pattern: 'CARDINAL',
        z: 2
    },
    target: {
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
    target: {
        min: 0,
        max: 0,
        pattern: 'POINT'
    }
};

// -----------------------
// TP-COST SKILLS
// ---------------------------

GAME_DATA.skills['flicker'] = {
    name: 'Flicker Strike',
    description: '...',
    range:     { min: 1, max: null, pattern: 'CARDINAL', z: 0 },
    selection: { min: 0, max: 0,    pattern: 'POINT',    z: 0 },
    target: 'enemy', // ['ally', 'neutral', 'foe', 'entity', 'tile']
    movement: true, // show movement markers for this skill
    teleport: false,
    destination: 'before-target', // where movement markers will point to ['target', 'before-target']
    sequence: [
        {
            type: 'animation',
            unit: 'attacker',
            id: 'brace'
        },
        {
            type: 'effect',
            category: 'tile',
            location: 'origin',
            id: 'crackle',
            z: 1
        },
        {
            type: 'animation',
            id: 'crouch',
            movement: true,
            location: 'before-target',
            await: 'move-complete'
        },
        {
            type: 'animation',
            unit: 'attacker',
            id: 'slash',
            await: 'hit'
        },
        {
            type: 'animation',
            unit: 'defender',
            id: 'stagger'
        },
        {
            type: 'damage',
            unit: 'defender',
            percent: 25
        },
        {
            type: 'wait',
            ms: 1000
        },
        {
            type: 'effect',
            category: 'map',
            location: 'target',
            id: 'lightning',
            await: 'lightning-complete'
        },
        {
            type: 'damage',
            unit: 'defender',
            percent: 75
        },
        {
            type: 'status',
            unit: 'defender'
        }
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
    target: {
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
    target: {
        min: 0,
        max: null,
        pattern: 'ENTITIES',
        z: 2
    }
};