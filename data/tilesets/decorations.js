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
        "0": { "name": "Empty",       "idx": -1 },
        "1": { "name": "Grass",       "idx": 0 },
        "2": { "name": "Heavy Grass", "idx": 3 },
        "3": {
            "name": "Animation Test",
            "frames": [
                { "idx": 0, "ms": 3000 },
                { "idx": 3, "ms": 500, "next": 2 }
            ]
        },
        "4": {
            "name": "Waterfall 1",
            "frames": [
                { "idx": 4, "ms": 200 },
                { "idx": 5, "ms": 200 },
                { "idx": 6, "ms": 200 },
                { "idx": 7, "ms": 200, "next": 4 }
            ]
        },
        "5": {
            "name": "Waterfall 2-2",
            "frames": [
                { "idx": 10, "ms": 200, "oy": 48 },
                { "idx": 11, "ms": 200, "oy": 48 },
                { "idx": 12, "ms": 200, "oy": 48 },
                { "idx": 13, "ms": 200, "oy": 48, "next": 5 }
            ]
        },
        "6": {
            "name": "Waterfall 2-1",
            "frames": [
                { "idx": 4, "ms": 200, "oy": 72 },
                { "idx": 5, "ms": 200, "oy": 72 },
                { "idx": 6, "ms": 200, "oy": 72 },
                { "idx": 7, "ms": 200, "oy": 72, "next": 6 }
            ]
        },
        "7": {
            "name": "Waterfall 3-2",
            "mirror": true,
            "frames": [
                { "idx": 10, "ms": 200, "oy": 48 },
                { "idx": 11, "ms": 200, "oy": 48 },
                { "idx": 12, "ms": 200, "oy": 48 },
                { "idx": 13, "ms": 200, "oy": 48, "next": 7 }
            ]
        },
        "8": {
            "name": "Waterfall 3-1",
            "mirror": true,
            "frames": [
                { "idx": 4, "ms": 200, "oy": 72 },
                { "idx": 5, "ms": 200, "oy": 72 },
                { "idx": 6, "ms": 200, "oy": 72 },
                { "idx": 7, "ms": 200, "oy": 72, "next": 8 }
            ]
        }
    }
};