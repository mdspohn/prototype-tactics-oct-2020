if (GAME_DATA.tilesets == undefined)
    GAME_DATA.tilesets = new Object();

GAME_DATA.tilesets.maps = new Object();
GAME_DATA.tilesets.maps['woodlands'] = {
    "src": "woodlands.png",
    "measurements": {
        "sprite": {
            "height": 8,
            "width": 32,
            "depth": 16
        }
    },
    "config": {
        "0": { "name": "Empty", "unreachable": true, "idx": -1 },
        "1": { "name": "Grass",       "idx": 0 },
        "2": { "name": "Dirt Slope",  "idx": 1, "slope": true },
        "3": { "name": "Water",       "idx": 2, "water": true },
        "4": { "name": "Dirt", "idx": 3 },
        "5": { "name": "Ice",   "idx": 4 },
        "6": { "name": "Stump",       "idx": 5 },
        "7": { "name": "Dirt Slope 2",       "idx": 6, "slope": true },
        "8": { "name": "Dirt Slope 2 Mirror",       "idx": 6, "slope": true, "mirror": true },
        "9": { "name": "Dirt Slope Mirror",  "idx": 1, "slope": true, "mirror": true },
        "10": {
            "name": "Bottom Half Rising",
            "frames": [
                { "idx": 0, "ms": 50, "oy": 8 },
                { "idx": 0, "ms": 50, "oy": 7 },
                { "idx": 0, "ms": 50, "oy": 6 },
                { "idx": 0, "ms": 50, "oy": 5 },
                { "idx": 0, "ms": 50, "oy": 4 },
                { "idx": 0, "ms": 50, "oy": 3 },
                { "idx": 0, "ms": 50, "oy": 2 },
                { "idx": 0, "ms": 50, "oy": 1 },
                { "idx": 0, "ms": 50, "oy": 0 },
                { "idx": 0, "ms": 50, "oy": 0, "next": 1 },
            ]
        },
        "11": {
            "name": "Top Half Rising",
            "frames": [
                { "idx": 0, "ms": 25, "oy": 16 },
                { "idx": 0, "ms": 25, "oy": 15 },
                { "idx": 0, "ms": 25, "oy": 14 },
                { "idx": 0, "ms": 25, "oy": 13 },
                { "idx": 0, "ms": 25, "oy": 12 },
                { "idx": 0, "ms": 25, "oy": 11 },
                { "idx": 0, "ms": 25, "oy": 10 },
                { "idx": 0, "ms": 25, "oy": 9 },
                { "idx": 0, "ms": 25, "oy": 8 },
                { "idx": 0, "ms": 25, "oy": 7 },
                { "idx": 0, "ms": 25, "oy": 6 },
                { "idx": 0, "ms": 25, "oy": 5 },
                { "idx": 0, "ms": 25, "oy": 4 },
                { "idx": 0, "ms": 25, "oy": 3 },
                { "idx": 0, "ms": 25, "oy": 2 },
                { "idx": 0, "ms": 25, "oy": 1 },
                { "idx": 0, "ms": 25, "oy": 0 },
                { "idx": 0, "ms": 25, "oy": 0 },
                { "idx": 0, "ms": 25, "oy": 0 },
                { "idx": 0, "ms": 25, "oy": 0, "next": 1 },
            ]
        },
        "12": {
            "name": "Bottom Half Lowering",
            "frames": [
                { "idx": 0, "ms": 50, "oy": 0 },
                { "idx": 0, "ms": 50, "oy": 1 },
                { "idx": 0, "ms": 50, "oy": 2 },
                { "idx": 0, "ms": 50, "oy": 3 },
                { "idx": 0, "ms": 50, "oy": 4 },
                { "idx": 0, "ms": 50, "oy": 5 },
                { "idx": 0, "ms": 50, "oy": 6 },
                { "idx": 0, "ms": 50, "oy": 7 },
                { "idx": 0, "ms": 50, "oy": 8 },
                { "idx": 0, "ms": 50, "oy": 8, "next": 10 },
            ]
        },
        "13": {
            "name": "Top Half Lowering",
            "frames": [
                { "idx": 0, "ms": 25, "oy": 0 },
                { "idx": 0, "ms": 25, "oy": 1 },
                { "idx": 0, "ms": 25, "oy": 2 },
                { "idx": 0, "ms": 25, "oy": 3 },
                { "idx": 0, "ms": 25, "oy": 4 },
                { "idx": 0, "ms": 25, "oy": 5 },
                { "idx": 0, "ms": 25, "oy": 6 },
                { "idx": 0, "ms": 25, "oy": 7 },
                { "idx": 0, "ms": 25, "oy": 8 },
                { "idx": 0, "ms": 25, "oy": 9 },
                { "idx": 0, "ms": 25, "oy": 10 },
                { "idx": 0, "ms": 25, "oy": 11 },
                { "idx": 0, "ms": 25, "oy": 12 },
                { "idx": 0, "ms": 25, "oy": 13 },
                { "idx": 0, "ms": 25, "oy": 14 },
                { "idx": 0, "ms": 25, "oy": 15 },
                { "idx": 0, "ms": 25, "oy": 16 },
                { "idx": 0, "ms": 25, "oy": 16 },
                { "idx": 0, "ms": 25, "oy": 16 },
                { "idx": 0, "ms": 25, "oy": 16, "next": 11 },
            ]
        },
        "15": {
            "name": "Quake",
            "frames": [
                { "idx": 0, "ms": 50, "oy": 0 },
                { "idx": 0, "ms": 50, "oy": -1 },
                { "idx": 0, "ms": 50, "oy": -2 },
                { "idx": 0, "ms": 50, "oy": -3 },
                { "idx": 0, "ms": 50, "oy": -4 },
                { "idx": 0, "ms": 50, "oy": -3 },
                { "idx": 0, "ms": 50, "oy": -2 },
                { "idx": 0, "ms": 50, "oy": -1 }
            ]
        }
    }
};