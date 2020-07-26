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
        0: {
            "name": "Empty",
            "idx": -1,
            "unreachable": true
        },
        1: {
            "name": "Grass",
            "idx": 0
        },
        2: {
            "name": "Raised Grass",
            "idx": 0,
            "oy": -2
        },
        6: {
            "name": "Grass Slope - Rising North",
            "idx": 1,
            "slope": true,
            "orientation": "n",
        },
        7: {
            "name": "Grass Slope - Rising West",
            "idx": 2,
            "slope": true,
            "orientation": "w"
        },
        8: {
            "name": "Grass Slope - Rising South",
            "idx": 3,
            "slope": true,
            "orientation": "s"
        },
        9: {
            "name": "Grass Slope - Rising East",
            "idx": 4,
            "slope": true,
            "orientation": "e"
        },
        11: {
            "name": "Dirt",
            "idx": 10
        },
        12: {
            "name": "Raised Dirt",
            "idx": 10,
            "oy": -2
        },
        16: {
            "name": "Dirt Slope - Rising North",
            "idx": 11,
            "slope": true,
            "orientation": "n"
        },
        17: {
            "name": "Dirt Slope - Rising West",
            "idx": 12,
            "slope": true,
            "orientation": "w"
        },
        18: {
            "name": "Dirt Slope - Rising South",
            "idx": 13,
            "slope": true,
            "orientation": "s"
        },
        19: {
            "name": "Dirt Slope - Rising East",
            "idx": 14,
            "slope": true,
            "orientation": "e"
        },
        21: {
            "name": "Water",
            "idx": 20,
            "water": true
        },
        "impact": {
            "frames": [
                { "idx": 10, "ms": 200, "oy": 4 },
                { "idx": 10, "ms": 100, "oy": 3 },
                { "idx": 10, "ms": 75,  "oy": 2 },
                { "idx": 10, "ms": 50,  "oy": 1, "next": 11 },
            ]
        },
        "impact-to-water": {
            "frames": [
                { "idx": 20, "ms": 150, "oy": 4 },
                { "idx": 20, "ms": 100, "oy": 3 },
                { "idx": 20, "ms": 75,  "oy": 2 },
                { "idx": 20, "ms": 50,  "oy": 1, "next": 21 },
            ]
        },
        "shockwave": {
            "frames": [
                { "idx": 10, "ms": 200, "oy": -2 },
                { "idx": 10, "ms": 100, "oy": -1, "next": 11 }
            ]
        },
        "shockwave-2": {
            "frames": [
                { "idx": 10, "ms": 50, "oy": 4 },
                { "idx": 10, "ms": 50, "oy": 2 },
                { "idx": 10, "ms": 50, "oy": 0, "next": 11 }
            ]
        },
        "push-off": {
            "frames": [
                { "idx": 10, "ms": 150, "oy": 2 },
                { "idx": 10, "ms": 100, "oy": 1, "next": 11 },
            ]
        },
    }
};