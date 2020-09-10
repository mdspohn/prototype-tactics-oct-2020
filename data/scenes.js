GAME_DATA.scenes['test'] = {
    type: 'COMBAT',
    area: 'test',
    entities: [
        {
            id: 'player',
            x: 4,
            y: 4,
            orientation: 'east',
            equipment: {
                weapon: 'knife',
                //accessory_1: 'buckler',
                //headgear: 'rose'
                //armor: 'iron-armor'
            },
            basic: 'sword',
            skills: ['magic', 'bow', 'spear']
        },
        {
            id: 'slime',
            x: 2,
            y: 5,
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
    area: 'arena',
    entities: [
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