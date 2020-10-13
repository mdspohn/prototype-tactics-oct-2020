GAME_DATA.skills["EXAMPLE_ATTACK"] = {
    name: 'EXAMPLE_ATTACK',
    description: 'EXAMPLE_ATTACK the target using an EXAMPLE_WEAPON.',
    tp: 0,
    mp: 0,
    projectile: false,
    arc: false,
    range: {
        selection: 'cardinal', // diagonal, square, fill
        phase: false, // ignore obstructions
        zu: 2,  // nullable
        zd: 2,  // nullable
        min: 1, // nullable
        max: 1  // nullable
    },
    target: {
        selection: 'cardinal', // diagonal, square, fill, to-point, enemy, ally, all
        tiles: true, // can target empty tiles
        phase: false, // ignore obstructions
        overflow: false, // can affect tiles outside of range if AoE
        zu: 2,  // nullable
        zd: 2,  // nullable
        min: 0, // nullable
        max: 0  // nullable
    },
    selectable: ['ally', 'enemy', 'self', 'empty'],
    sequence: [
        {
            category: 'animation', // [animation, filter, damage, wait]
            type: 'beast',         // [beast, tile, decoration]
            on: 'self',            // [self, primary, secondary, all]
            animations: [
                { id: 'brace' },
                {   // example of dashing to tile next to target
                    id: 'dash', 
                    movement: true,                // move
                    destination: 'primary',        // to destination ['self', 'attacker', 'primary', 'target']
                    offset: -1,                    // with this tile offset
                    orientation: 'to-destination', // based on the orientation of ['self', 'attacker', 'primary', 'to-destination']
                },
                { id: 'slash' }
            ],
            wait: 'hit'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'primary',
            animations: [
                {   // example of knockback from target point
                    id: 'stagger',
                    movement: true,
                    destination: 'target',
                    offset: -1,
                    orientation: 'to-destination',
                }
            ]
        },
        {
            category: 'damage',
            on: 'primary',
            percentage: 100,
            allowKnockback: true
        },
        {
            category: 'filter',
            on: 'primary',
            filters: [
                { type: 'brightness', suffix: '%', i: 100, t: 0,   duration: 150, revert: true },
                { type: 'invert',     suffix: '%', i: 0,   t: 100, duration: 150, revert: true }
            ],
            wait: 'brightness-filter-complete'
        }
    ]
};

GAME_DATA.skills["slash"] = {
    name: 'Slash',
    description: 'Slash at the target using a one-handed weapon.',
    range:  { selection: 'cardinal', zu: 2, zd: 2, min: 1, max: 1 },
    target: { selection: 'cardinal', zu: 2, zd: 2, min: 0, max: 0 },
    selectable: ['ally', 'enemy'],
    power: 25,
    sequence: [
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [
                { id: 'slash' }
            ],
            wait: 'hit'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'primary',
            animations: [
                { id: 'stagger' }
            ]
        },
        {
            category: 'damage',
            on: 'primary',
            percentage: 100
        },
        {
            category: 'filter',
            on: 'primary',
            filters: [
                { type: 'brightness', suffix: '%', i: 100, t: 0,   duration: 250, revert: true },
                { type: 'invert',     suffix: '%', i: 0,   t: 100, duration: 250, revert: true }
            ],
            wait: 'brightness-filter-complete'
        }
    ]
};

GAME_DATA.skills["double-slash"] = {
    name: 'Double Slash',
    description: 'Slash at the target using a one-handed weapon, then feint into a second swing.',
    range:  { selection: 'cardinal', zu: 2, zd: 2, min: 1, max: 1 },
    target: { selection: 'cardinal', zu: 2, zd: 2, min: 0, max: 0 },
    selectable: ['ally', 'enemy'],
    power: 40,
    sequence: [
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [
                { id: 'slash' }
            ],
            wait: 'hit'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'primary',
            animations: [
                { id: 'stagger' }
            ]
        },
        {
            category: 'damage',
            type: 'beast',
            on: 'primary',
            percentage: 40
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'brightness', suffix: '%', i: 100, t: 0,   duration: 250, revert: true },
                { type: 'invert',     suffix: '%', i: 0,   t: 100, duration: 250, revert: true }
            ],
            wait: 'brightness-filter-complete'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [
                { id: 'slash-reverse' }
            ],
            wait: 'hit'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'primary',
            animations: [
                {   
                    id: 'stagger',
                }
            ]
        },
        {
            category: 'damage',
            type: 'beast',
            on: 'primary',
            percentage: 60
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'brightness', suffix: '%', i: 100, t: 0,   duration: 250, revert: true },
                { type: 'invert',     suffix: '%', i: 0,   t: 100, duration: 250, revert: true }
            ],
            wait: 'brightness-filter-complete'
        }
    ]
};

GAME_DATA.skills["heavy-slash"] = {
    name: 'Heavy Slash',
    description: 'Slash at the target using a two-handed weapon. Knocks the target back.',
    range:  { selection: 'cardinal', zu: 2, zd: 2, min: 1, max: 1 },
    target: { selection: 'cardinal', zu: 2, zd: 2, min: 0, max: 0 },
    selectable: ['ally', 'enemy'],
    sequence: [
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [
                { id: 'heavy-slash' },
            ],
            wait: 'hit'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'primary',
            animations: [
                {   
                    id: 'stagger',
                    movement: true,
                    destination: 'self',
                    offset: 1,
                    orientation: 'attacker',
                }
            ]
        },
        {
            category: 'damage',
            on: 'primary',
            percentage: 100
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'brightness', suffix: '%', i: 100, t: 0,   duration: 150, revert: true },
                { type: 'invert',     suffix: '%', i: 0,   t: 100, duration: 150, revert: true }
            ],
            wait: 'brightness-filter-complete'
        }
    ]
};

GAME_DATA.skills["leap-slash"] = {
    name: 'Leap Slash',
    description: 'Leap at the target, coming down with all your weight into your weapon.',
    range:  { selection: 'cardinal', zu: 2, zd: 2, min: 1, max: 4 },
    target: { selection: 'cardinal', zu: 2, zd: 2, min: 0, max: 0 },
    selectable: ['ally', 'enemy'],
    power: 25,
    sequence: [
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [
                // { id: 'brace' },
                {   
                    id: 'leap-slash',
                    movement: true,
                    type: 'teleport',
                    destination: 'target',
                    offset: -1,
                    orientation: 'to-destination',
                }
            ],
            wait: 'hit'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'primary',
            animations: [ { 
                id: 'stagger',
                movement: true,
                destination: 'self',
                offset: 1,
                orientation: 'attacker',
            } ]
        },
        {
            category: 'damage',
            on: 'primary',
            percentage: 100
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'brightness', suffix: '%', i: 100, t: 0,   duration: 150, revert: true },
                { type: 'invert',     suffix: '%', i: 0,   t: 100, duration: 150, revert: true }
            ],
            wait: 'brightness-filter-complete'
        }
    ]
};

GAME_DATA.skills["anime-slash"] = {
    name: 'Anime Slash',
    description: 'You\'re already dead.',
    range:  { selection: 'cardinal', zu: 2, zd: 2, min: 1, max: 4 },
    target: { selection: 'cardinal', zu: 2, zd: 2, min: 0, max: 0 },
    selectable: ['ally', 'enemy'],
    power: 999,
    sequence: [
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [
                {   
                    id: 'brace',
                }
            ],
            wait: 'brace-complete'
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'self',
            filters: [
                { type: 'opacity', suffix: '%', i: 50, t: 0,   duration: 200, revert: true },
            ]
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [
                {   
                    id: 'dash',
                    movement: true,
                    type: 'teleport',
                    destination: 'target',
                    offset: 2,
                    orientation: 'to-destination',
                }
            ],
            wait: 'move-complete'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [
                {   
                    id: 'anime'
                }
            ],
            wait: 'hit'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'primary',
            animations: [ { id: 'stagger' } ]
        },
        {
            category: 'damage',
            on: 'primary',
            percentage: 100
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'brightness', suffix: '%', i: 100, t: 0,   duration: 150, revert: true },
                { type: 'invert',     suffix: '%', i: 0,   t: 100, duration: 150, revert: true }
            ],
            wait: 'brightness-filter-complete'
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'brightness', suffix: '%', i: 100, t: 0,   duration: 150, revert: true },
                { type: 'invert',     suffix: '%', i: 0,   t: 100, duration: 150, revert: true }
            ],
            wait: 'brightness-filter-complete'
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'opacity', suffix: '%', i: 100, t: 0, duration: 250, revert: false },
            ],
            wait: 'opacity-filter-complete'
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'opacity', suffix: '%', i: 0, t: 1, duration: 3000, revert: false },
            ],
            wait: 'opacity-filter-complete'
        }
    ]
};
GAME_DATA.skills["sneak"] = {
    range:  { selection: 'fill', zu: 2, zd: 2, min: 1, max: 6 },
    target: { selection: 'cardinal', zu: 2, zd: 2, min: 0, max: 0 },
    selectable: ['ally', 'enemy'],
    sequence: [
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'hue-rotate', suffix: 'deg', i: 0, t: 1440, duration: 3000, revert: true },
            ]
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [ { 
                id: 'crouch',
            } ]
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'self',
            filters: [
                { type: 'opacity', suffix: '%', i: 100, t: 0, duration: 1000, revert: false },
            ],
            wait: 'opacity-filter-complete'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [ { 
                id: 'crouch',
                movement: true,
                type: 'teleport',
                destination: 'target',
                offset: -1,
                orientation: 'to-destination',
            } ]
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'self',
            filters: [
                { type: 'opacity', suffix: '%', i: 0, t: 1, duration: 1000, revert: false },
            ],
            wait: 'opacity-filter-complete'
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'self',
            filters: [
                { type: 'opacity', suffix: '%', i: 0, t: 100, duration: 500, revert: false },
            ]
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'self',
            animations: [ { 
                id: 'slash',
            } ],
            wait: 'hit'
        },
        {
            category: 'animation',
            type: 'beast',
            on: 'primary',
            animations: [ { 
                id: 'stagger',
            } ]
        },
        {
            category: 'damage',
            on: 'primary',
            percentage: 100
        },
        {
            category: 'filter',
            type: 'beast',
            on: 'primary',
            filters: [
                { type: 'brightness', suffix: '%', i: 100, t: 0,   duration: 150, revert: true },
                { type: 'invert',     suffix: '%', i: 0,   t: 100, duration: 150, revert: true }
            ],
            wait: 'brightness-filter-complete'
        },
    ]
};

GAME_DATA.skills["pull"] = {
    range:  { selection: 'cardinal', zu: 2, zd: 2, min: 1, max: 4 },
    target: { selection: 'cardinal', zu: 2, zd: 2, min: 0, max: 0, overflow: true },
    selectable: ['ally', 'enemy'],
    sequence: [
        {
            category: 'animation',
            type: 'beast',
            on: 'primary',
            animations: [ { 
                id: 'stagger',
                movement: true,
                type: 'teleport',
                destination: 'attacker',
                offset: -1,
                orientation: 'to-destination',
            } ]
        }
    ]
};

GAME_DATA.skills["push"] = {
    range:  { selection: 'fill', zu: 2, zd: 2, min: 1, max: 4 },
    target: { selection: 'cardinal', zu: 2, zd: 2, min: 0, max: 1, overflow: true },
    selectable: ['ally', 'enemy'],
    sequence: [
        {
            category: 'animation',
            type: 'beast',
            on: 'secondary',
            animations: [ { 
                id: 'stagger',
                movement: true,
                type: 'teleport',
                destination: 'self',
                offset: -5,
                orientation: 'to-destination',
            } ]
        }
    ]
};

GAME_DATA.skills['anime'] = {
    name: 'Melee Attack',
    description: '...',
    range: {
        min: 1,
        max: 4,
        pattern: 'CARDINAL',
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
            subject: 'attacker',
            id: 'anime',
            await: 'hit'
        },
        {
            type: 'filter',
            subject: 'attacker',
            filters: [
                {
                    type: 'opacity',
                    initial: 100,
                    target: 0,
                    suffix: '%',
                    duration: 200,
                    reverse: true
                }
            ]
        },
        {
            type: 'animation',
            subject: 'attacker',
            movement: {
                type: 'teleport',
                toLocation: 'target-after'
            },
            id: 'dash',
            await: 'move-complete'
        },
        {
            type: 'animation',
            subject: 'attacker',
            id: 'anime',
            await: 'hit'
        },
        {
            type: 'animation',
            subject: 'defender',
            id: 'hit'
        },
        {
            type: 'filter',
            subject: 'defender',
            filters: [
                {
                    type: 'brightness',
                    initial: 100,
                    target: 0,
                    suffix: '%',
                    duration: 100,
                    reverse: true
                },
                {
                    type: 'invert',
                    initial: 0,
                    target: 100,
                    suffix: '%',
                    duration: 100,
                    reverse: true
                }
            ],
            await: 'brightness-filter-complete'
        },
        {
            type: 'filter',
            subject: 'defender',
            filters: [
                {
                    type: 'brightness',
                    initial: 100,
                    target: 0,
                    suffix: '%',
                    duration: 100,
                    reverse: true
                },
                {
                    type: 'invert',
                    initial: 0,
                    target: 100,
                    suffix: '%',
                    duration: 100,
                    reverse: true
                }
            ],
            await: 'brightness-filter-complete'
        },
        {
            type: 'damage',
            subject: 'defender',
            amount: 'Miss',
            fontSize: 30
        },
        {
            type: 'filter',
            subject: 'defender',
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