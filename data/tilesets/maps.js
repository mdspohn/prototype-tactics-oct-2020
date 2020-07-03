if (GAME_DATA.tilesets == undefined)
    GAME_DATA.tilesets = new Object();

GAME_DATA.tilesets.maps = {
    'woodlands': {
        src: 'woodlands.png',
        config: {
            height: 8,
            width: 32,
            depth: 16
        },
        tiles: [
            {
                name: 'Grass',
                slope: false,
                idx: 0
            },
            {
                name: 'Dirt Slope',
                slope: true,
                idx: 1
            },
            {
                name: 'Water',
                slope: false,
                idx: 2
            },
            {
                name: 'Grass Slope',
                slope: true,
                idx: 3
            },
            {
                name: 'Waterfall',
                slope: false,
                idx: 4
            },
            {
                name: 'Stump',
                slope: false,
                idx: 5
            }
        ]
    }
};