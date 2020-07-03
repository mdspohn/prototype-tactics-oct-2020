if (GAME_DATA.tilesets == undefined)
    GAME_DATA.tilesets = new Object();

GAME_DATA.tilesets.decorations = {
    'woodlands': {
        src: 'woodlands.png',
        config: {
            height: 48,
            width: 32
        },
        tiles: {
            '1': {
                name: 'Grass',
                idx: 0
            },
            '2': {
                name: 'Heavy Grass',
                idx: 3
            }
        }
    }
};