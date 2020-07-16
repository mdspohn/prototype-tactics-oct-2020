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
        "0": { "name": "Empty",            "idx": -1,  "unreachable": true },
        "1": { "name": "Grass",            "idx": 0 },
        "2": { "name": "Dirt Slope North", "idx": 1,   "slope": true, "orientation": "n" },
        "9": { "name": "Dirt Slope West",  "idx": 7,   "slope": true, "orientation": "w" },
        "4": { "name": "Dirt",             "idx": 3 },
        "5": { "name": "Ice",              "idx": 4 },
        "6": { "name": "Stump",            "idx": 5 },
        "7": { "name": "Dirt Slope South", "idx": 6,   "slope": true, "orientation": "s" },
        "8": { "name": "Dirt Slope East",  "idx": 8,   "slope": true, "orientation": "e" },
        "3": { "name": "Water",            "idx": 2,   "water": true }
    }
};