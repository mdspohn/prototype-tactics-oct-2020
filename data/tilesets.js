GAME_DATA.tilesets = new Object();

GAME_DATA.tilesets['woodlands'] = {
    dir: 'maps',
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
            name: 'Stump',
            slope: false,
            idx: 5
        }
    ]
};

GAME_DATA.tilesets['flora'] = {
    dir: 'decorations',
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
};

GAME_DATA.tilesets['slime'] = {
    dir: 'characters',
    src: 'slime.png',
    config: {
        height: 32,
        width: 32
    }
};

GAME_DATA.tilesets['mimic'] = {
    dir: 'characters',
    src: 'mimic.png',
    config: {
        height: 32,
        width: 32
    }
};