if (GAME_DATA.tilesets == undefined)
    GAME_DATA.tilesets = new Object();

GAME_DATA.tilesets.decorations = new Object();

GAME_DATA.tilesets.decorations['woodlands'] = {
    "src": "woodlands.png",
    "measurements": {
        "sprite": {
            "height": 48,
            "width": 32
        }
    },
    "config": {
        "0": { "name": "Empty",       "frame": -1 },
        "1": { "name": "Grass",       "frame": 0 },
        "2": { "name": "Heavy Grass", "frame": 3 },
        "3": {
            "name": "Animation Test",
            "animation": [
                { "frame": 0, "ms": 3000 },
                { "frame": 3, "ms": 10, "stop": true }
            ]
        }
    }
};