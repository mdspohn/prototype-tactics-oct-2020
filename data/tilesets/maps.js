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
        "0": { "name": "Empty", "unreachable": true, "frame": -1 },
        "1": { "name": "Grass",       "frame": 0 },
        "2": { "name": "Dirt Slope",  "frame": 1, "slope": true },
        "3": { "name": "Water",       "frame": 2, "water": true },
        "4": { "name": "Grass Slope", "frame": 3, "slope": true },
        "5": { "name": "Waterfall",   "frame": 4 },
        "6": { "name": "Stump",       "frame": 5 },
        "10": {
            "name": "Empty",
            "unreachable": true,
            "animation": [
                { "frame": 0, "ms": 50, "oy": 8, "ox": 0 },
                { "frame": 0, "ms": 50, "oy": 7, "ox": 1 },
                { "frame": 0, "ms": 50, "oy": 6, "ox": 0 },
                { "frame": 0, "ms": 50, "oy": 5, "ox": -1 },
                { "frame": 0, "ms": 50, "oy": 4, "ox": 0 },
                { "frame": 0, "ms": 50, "oy": 3, "ox": 1 },
                { "frame": 0, "ms": 50, "oy": 2, "ox": 0 },
                { "frame": 0, "ms": 50, "oy": 1, "ox": -1 },
                { "frame": 0, "ms": 50, "oy": 0, "ox": 0 },
                { "frame": 0, "ms": 50, "oy": -1, "ox": 1 },
                { "frame": 0, "ms": 50, "oy": -2, "ox": 0 },
                { "frame": 0, "ms": 50, "oy": -3, "ox": -1 },
                { "frame": 0, "ms": 50, "oy": 0, "ox": 0, "stop": true },
            ]
        },
        "11": {
            "name": "Empty",
            "unreachable": true,
            "animation": [
                { "frame": 0, "ms": 25, "oy": 16, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 15, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 14, "ox": 1 },
                { "frame": 0, "ms": 25, "oy": 13, "ox": 1 },
                { "frame": 0, "ms": 25, "oy": 12, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 11, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 10, "ox": -1 },
                { "frame": 0, "ms": 25, "oy": 9, "ox": -1 },
                { "frame": 0, "ms": 25, "oy": 8, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 7, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 6, "ox": 1 },
                { "frame": 0, "ms": 25, "oy": 5, "ox": 1 },
                { "frame": 0, "ms": 25, "oy": 4, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 3, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 2, "ox": -1 },
                { "frame": 0, "ms": 25, "oy": 1, "ox": -1 },
                { "frame": 0, "ms": 25, "oy": 0, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 0, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": -1, "ox": -1 },
                { "frame": 0, "ms": 25, "oy": -1, "ox": -1 },
                { "frame": 0, "ms": 25, "oy": -2, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": -2, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": -3, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": -3, "ox": 0 },
                { "frame": 0, "ms": 25, "oy": 0, "ox": 0, "stop": true },
            ]
        }
    }
};