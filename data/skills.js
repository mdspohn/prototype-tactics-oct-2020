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
    }
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
        min: 1,
        max: 2,
        pattern: 'FILL',
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