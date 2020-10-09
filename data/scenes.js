GAME_DATA.scenes['temple'] = {
    type: 'COMBAT',
    map: 'temple',
    beasts: [
        {
            id: 'player',
            x: 2,
            y: 12,
            orientation: 'south',
            equipment: {
                weapon: 'knife',
                //accessory_1: 'buckler',
            },
        },
        {
            id: 'slime',
            x: 6,
            y: 12,
            orientation: 'east',
            basic: 'bow'
        },
        {
            id: 'mimic',
            x: 2,
            y: 14,
            orientation: 'south'
        }
    ]
};

GAME_DATA.scenes['test'] = {
    type: 'COMBAT',
    map: 'woodlands',
    beasts: [
        {
            id: 'player',
            x: 5,
            y: 2,
            orientation: 'east',
            equipment: {
                weapon: 'knife',
                //accessory_1: 'buckler',
                headgear: 'rose',
                // armor: 'iron-armor'
            },
            basic: 'sword',
            skills: ['magic', 'bow', 'spear']
        },
        {
            id: 'slime',
            x: 5,
            y: 3,
            orientation: 'south',
            basic: 'bow'
        },
        // {
        //     id: 'mimic',
        //     x: 6,
        //     y: 1,
        //     orientation: 'south'
        // }
    ]
};

GAME_DATA.scenes['arena'] = {
    type: 'COMBAT',
    map: 'arena',
    beasts: [
        {
            id: 'player',
            x: 1,
            y: 0,
            orientation: 'east',
            equipment: {
                weapon: 'knife',
                accessory_1: 'buckler',
                headgear: 'rose'
                //armor: 'iron-armor'
            }
        },
        //{id: 'slime', x: 4, y: 0, orientation: 's'},
        // {id: 'player', x: 5, y: 3, orientation: 's'},
        // {id: 'player', x: 5, y: 2, orientation: 'n'},
        // {id: 'player', x: 6, y: 2, orientation: 'w'}
    ]
};