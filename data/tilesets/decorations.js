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
            "oy": 56,
            "ox": 15,
            "frames": [
                { "idx": 10, "ms": 200 },
                { "idx": 11, "ms": 200 },
                { "idx": 12, "ms": 200 },
                { "idx": 13, "ms": 200, "next": 5 }
            ]
        },
        "6": {
            "name": "Waterfall 2-1",
            "oy": 80,
            "ox": 15,
            "frames": [
                { "idx": 4, "ms": 200 },
                { "idx": 5, "ms": 200 },
                { "idx": 6, "ms": 200 },
                { "idx": 7, "ms": 200, "next": 6 }
            ]
        },
        "7": {
            "name": "Waterfall 3-2",
            "mirror": true,
            "oy": 56,
            "ox": 15,
            "frames": [
                { "idx": 10, "ms": 200 },
                { "idx": 11, "ms": 200 },
                { "idx": 12, "ms": 200 },
                { "idx": 13, "ms": 200, "next": 7 }
            ]
        },
        "8": {
            "name": "Waterfall 3-1",
            "mirror": true,
            "oy": 80,
            "ox": 15,
            "frames": [
                { "idx": 4, "ms": 200 },
                { "idx": 5, "ms": 200 },
                { "idx": 6, "ms": 200 },
                { "idx": 7, "ms": 200, "next": 8 }
            ]
        },
        "9": { "name": "Offset Grass", "idx": 8, "ox": -3, "oy": -8 },
        "10": {
            "name": "Waterfall 2-2",
            "oy": 32,
            "ox": 16,
            "mirror": true,
            "frames": [
                { "idx": 10, "ms": 200 },
                { "idx": 11, "ms": 200 },
                { "idx": 12, "ms": 200 },
                { "idx": 13, "ms": 200, "next": 10 }
            ]
        },
        "11": {
            "name": "Waterfall 2-2",
            "oy": 7,
            "ox": -1,
            "mirror": true,
            "frames": [
                { "idx": 4, "ms": 200 },
                { "idx": 5, "ms": 200 },
                { "idx": 6, "ms": 200 },
                { "idx": 7, "ms": 200, "next": 11 }
            ]
        }
    }
};