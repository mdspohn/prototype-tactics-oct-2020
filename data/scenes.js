GAME_DATA.scenes = new Object();

GAME_DATA.scenes['test'] = {
    type: 'COMBAT',
    area: 'woodlands',
    entities: [{id: 'slime', x: 6, y: 0}, {id: 'mimic', x: 1, y: 4} ]
};

GAME_DATA.scenes['arena'] = {
    type: 'COMBAT',
    area: 'arena',
    entities: [
        //{id: 'slime', x: 1, y: 2},
        {id: 'player', x: 4, y: 3, orientation: 'w'},
        {id: 'player', x: 0, y: 0, orientation: 's'},
        {id: 'player', x: 6, y: 3, orientation: 'n'}
        //{id: 'mimic', x: 4, y: 1}
    ]
};