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
        "0": {
            "name": "Empty",
            "unreachable": true,
            "animation": [
                { "frame": -1, "ms": 100 },
                { "frame": 0,  "ms": 100 }
            ]
        },
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
                { "frame": 0, "ms": 50, "oy": 8 },
                { "frame": 0, "ms": 50, "oy": 7 },
                { "frame": 0, "ms": 50, "oy": 6 },
                { "frame": 0, "ms": 50, "oy": 5 },
                { "frame": 0, "ms": 50, "oy": 4 },
                { "frame": 0, "ms": 50, "oy": 3 },
                { "frame": 0, "ms": 50, "oy": 2 },
                { "frame": 0, "ms": 50, "oy": 1 },
                { "frame": 0, "ms": 50, "oy": 0, "stop": true },
            ]
        },
    }
};