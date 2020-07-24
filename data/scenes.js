GAME_DATA.scenes = new Object();

GAME_DATA.scenes['test'] = {
    type: 'COMBAT',
    area: 'woodlands',
    entities: [
        {id: 'player', x: 4, y: 2, orientation: 'e'},
        {id: 'player', x: 5, y: 3, orientation: 's'},
        {id: 'player', x: 5, y: 1, orientation: 'n'},
        {id: 'player', x: 6, y: 2, orientation: 'w'}
    ]
};

GAME_DATA.scenes['arena'] = {
    type: 'COMBAT',
    area: 'arena',
    entities: [
        {id: 'player', x: 1, y: 0, orientation: 's'},
        {id: 'slime', x: 4, y: 0, orientation: 's'},
        // {id: 'player', x: 5, y: 3, orientation: 's'},
        // {id: 'player', x: 5, y: 2, orientation: 'n'},
        // {id: 'player', x: 6, y: 2, orientation: 'w'}
    ]
};