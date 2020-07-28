GAME_DATA.scenes['test'] = {
    type: 'COMBAT',
    area: 'woodlands',
    entities: [
        {id: 'player', x: 4, y: 2, orientation: 'east'},
        {id: 'player', x: 5, y: 3, orientation: 'south'},
        {id: 'player', x: 5, y: 1, orientation: 'north'},
        {id: 'player', x: 6, y: 2, orientation: 'west'}
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
            orientation: 'south',
            accessory_1: 'buckler'
        },
        //{id: 'slime', x: 4, y: 0, orientation: 's'},
        // {id: 'player', x: 5, y: 3, orientation: 's'},
        // {id: 'player', x: 5, y: 2, orientation: 'n'},
        // {id: 'player', x: 6, y: 2, orientation: 'w'}
    ]
};