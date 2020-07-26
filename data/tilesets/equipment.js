GAME_DATA.tilesets.equipment['one-handed'] = {
    "src": "one-handed.png",
    "measurements": {
        "sprite": {
            "height": 32,
            "width": 32
        }
    },
    "config": {
        "idle-e": {
            "frames": [
                { "idx": 3, "ms": 125, "px": .125, "py": .125 },
                { "idx": 4, "ms": 250, "px": .25,  "py": .25,  "pz": .50 },
                { "idx": 3, "ms": 125, "px": .125, "py": .125 },
                { "idx": 2, "ms": 125, "px": .125, "py": .125 },
                { "idx": 1, "ms": 250, "px": .25,  "py": .25,  "pz": .50 },
                { "idx": 2, "ms": 125, "px": .125, "py": .125 },
            ]
        },
        "idle-s": {
            "mirror": true,
            "frames": [
                { "idx": 3, "ms": 125, "px": .125, "py": .125 },
                { "idx": 4, "ms": 250, "px": .25,  "py": .25,  "pz": .50 },
                { "idx": 3, "ms": 125, "px": .125, "py": .125 },
                { "idx": 2, "ms": 125, "px": .125, "py": .125 },
                { "idx": 1, "ms": 250, "px": .25,  "py": .25,  "pz": .50 },
                { "idx": 2, "ms": 125, "px": .125, "py": .125 },
            ]
        },
        "idle-w": {
            "frames": [
                { "idx": 7, "ms": 125, "px": .125, "py": .125 },
                { "idx": 6, "ms": 250, "px": .25,  "py": .25 },
                { "idx": 7, "ms": 125, "px": .125, "py": .125 },
                { "idx": 8, "ms": 125, "px": .125, "py": .125 },
                { "idx": 9, "ms": 250, "px": .25,  "py": .25 },
                { "idx": 8, "ms": 125, "px": .125, "py": .125 }
            ]
        },
        "idle-n": {
            "mirror": true,
            "frames": [
                { "idx": 7, "ms": 125, "px": .125, "py": .125 },
                { "idx": 6, "ms": 250, "px": .25,  "py": .25 },
                { "idx": 7, "ms": 125, "px": .125, "py": .125 },
                { "idx": 8, "ms": 125, "px": .125, "py": .125 },
                { "idx": 9, "ms": 250, "px": .25,  "py": .25 },
                { "idx": 8, "ms": 125, "px": .125, "py": .125 }
            ]
        },
        "walk-e-0": {
            "frames": [
                { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 1, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-e-1": {
            "frames": [
                { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 4, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-s-0": {
            "mirror": true,
            "frames": [
                { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 1, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-s-1": {
            "mirror": true,
            "frames": [
                { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 4, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-w-0": {
            "frames": [
                { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 6, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-w-1": {
            "frames": [
                { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 9, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-n-0": {
            "mirror": true,
            "frames": [
                { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 6, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-n-1": {
            "mirror": true,
            "frames": [
                { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 9, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "jump-up-e": {
            "frames": [
                { "idx": 10, "ms": 500 },
                { "idx": 11, "ms": 100, "px": 0.3, "pz": 1 },
                { "idx": 11, "ms": 100, "px": 0.2 },
                { "idx": 11, "ms": 50,  "px": 0.1 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.25 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.75 },
                { "idx": 10, "ms": 150 },
                { "idx": 3,  "ms": 250 }
            ]
        },
        "jump-down-e": {
            "frames": [
                { "idx": 10, "ms": 500 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -4 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -2 },
                { "idx": 11, "ms": 100, "px": 0.2, "oy": -1, "py": 0.4 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6, "pz": 1 },
                { "idx": 10, "ms": 250 },
                { "idx": 3,  "ms": 250 }
            ]
        },
        "jump-up-s": {
            "mirror": true,
            "frames": [
                { "idx": 10, "ms": 500 },
                { "idx": 11, "ms": 100, "px": 0.3, "pz": 1, "oy": -1 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -2 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6, "oy": -4 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.4, "oy": -2 },
                { "idx": 10, "ms": 150 },
                { "idx": 3,  "ms": 250 }
            ]
        },
        "jump-down-s": {
            "mirror": true,
            "frames": [
                { "idx": 10, "ms": 500 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -4 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -2 },
                { "idx": 11, "ms": 100, "px": 0.2, "oy": -1, "py": 0.4 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6, "pz": 1 },
                { "idx": 10, "ms": 250 },
                { "idx": 3,  "ms": 250 }
            ]
        },
        "jump-up-w": {
            "frames": [
                { "idx": 12, "ms": 500 },
                { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "oy": -1 },
                { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "oy": -2 },
                { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -4 },
                { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -2 },
                { "idx": 12, "ms": 150 },
                { "idx": 8, "ms": 250 }
            ]
        },
        "jump-down-w": {
            "frames": [
                { "idx": 12, "ms": 500 },
                { "idx": 13, "ms": 50,  "px": 0.2, "oy": -3 },
                { "idx": 13, "ms": 50,  "px": 0.2, "oy": -6 },
                { "idx": 13, "ms": 100, "px": 0.3, "oy": -7 },
                { "idx": 13, "ms": 100, "px": 0.2, "oy": -7,            "pz": 0.1 },
                { "idx": 13, "ms": 50,  "px": 0.1, "oy": -4, "py": 0.4, "pz": 0.4 },
                { "idx": 13, "ms": 50,             "oy": -2, "py": 0.6, "pz": 0.5 },
                { "idx": 12, "ms": 250 },
                { "idx": 8, "ms": 250 }
            ]
        },
        "jump-up-n": {
            "mirror": true,
            "frames": [
                { "idx": 12, "ms": 500 },
                { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "oy": -1 },
                { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "oy": -2 },
                { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -4 },
                { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -2 },
                { "idx": 12, "ms": 150 },
                { "idx": 8, "ms": 250 }
            ]
        },
        "jump-down-n": {
            "mirror": true,
            "frames": [
                { "idx": 12, "ms": 500 },
                { "idx": 13, "ms": 50,  "px": 0.2, "oy": -3 },
                { "idx": 13, "ms": 50,  "px": 0.2, "oy": -6 },
                { "idx": 13, "ms": 100, "px": 0.3, "oy": -7 },
                { "idx": 13, "ms": 100, "px": 0.2, "oy": -7,             "pz": 0.1 },
                { "idx": 13, "ms": 50,  "px": 0.1, "oy": -4 ,"py": 0.4,  "pz": 0.4 },
                { "idx": 13, "ms": 50,             "oy": -2 ,"py": 0.6,  "pz": 0.5 },
                { "idx": 12, "ms": 250 },
                { "idx": 8, "ms": 250 }
            ]
        },
        "slash-e": {
            "frames": [
                { "idx": 20, "ms": 500, "ox": -2, "oy": -1 },
                { "idx": 21, "ms": 100, "ox": -1 },
                { "idx": 22, "ms": 500 }
            ]
        },
        "slash-s": {
            "mirror": true,
            "frames": [
                { "idx": 20, "ms": 500, "ox": 2, "oy": -1 },
                { "idx": 21, "ms": 100, "ox": 1 },
                { "idx": 22, "ms": 500 }
            ]
        }
    }
};

GAME_DATA.tilesets.equipment['shields'] = {
    "src": "shields.png",
    "measurements": {
        "sprite": {
            "height": 32,
            "width": 32
        }
    },
    "config": {
        "idle-e": {
            "layer": -1,
            "ox": 8,
            "oy": 12,
            "frames": [
                { "idx": 1, "ms": 125 },
                { "idx": 1, "ms": 250, "oy": 1 },
                { "idx": 1, "ms": 250 },
                { "idx": 1, "ms": 250, "oy": 1 },
                { "idx": 1, "ms": 125 },
            ]
        },
        "idle-s": {
            "layer": 1,
            "ox": 8,
            "oy": 12,
            "frames": [
                { "idx": 0, "ms": 125 },
                { "idx": 0, "ms": 250, "oy": 1 },
                { "idx": 0, "ms": 250 },
                { "idx": 0, "ms": 250, "oy": 1 },
                { "idx": 0, "ms": 125 },
            ]
        },
        "idle-w": {
            "frames": [
                { "idx": 7, "ms": 125, "px": .125, "py": .125 },
                { "idx": 6, "ms": 250, "px": .25,  "py": .25 },
                { "idx": 7, "ms": 125, "px": .125, "py": .125 },
                { "idx": 8, "ms": 125, "px": .125, "py": .125 },
                { "idx": 9, "ms": 250, "px": .25,  "py": .25 },
                { "idx": 8, "ms": 125, "px": .125, "py": .125 }
            ]
        },
        "idle-n": {
            "mirror": true,
            "frames": [
                { "idx": 7, "ms": 125, "px": .125, "py": .125 },
                { "idx": 6, "ms": 250, "px": .25,  "py": .25 },
                { "idx": 7, "ms": 125, "px": .125, "py": .125 },
                { "idx": 8, "ms": 125, "px": .125, "py": .125 },
                { "idx": 9, "ms": 250, "px": .25,  "py": .25 },
                { "idx": 8, "ms": 125, "px": .125, "py": .125 }
            ]
        },
        "walk-e-0": {
            "frames": [
                { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 1, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-e-1": {
            "frames": [
                { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 4, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-s-0": {
            "mirror": true,
            "frames": [
                { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 1, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-s-1": {
            "mirror": true,
            "frames": [
                { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 4, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-w-0": {
            "frames": [
                { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 6, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-w-1": {
            "frames": [
                { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 9, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-n-0": {
            "mirror": true,
            "frames": [
                { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 6, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "walk-n-1": {
            "mirror": true,
            "frames": [
                { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                { "idx": 9, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
                { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 }
            ]
        },
        "jump-up-e": {
            "frames": [
                { "idx": 10, "ms": 500 },
                { "idx": 11, "ms": 100, "px": 0.3, "pz": 1 },
                { "idx": 11, "ms": 100, "px": 0.2 },
                { "idx": 11, "ms": 50,  "px": 0.1 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.25 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.75 },
                { "idx": 10, "ms": 150 },
                { "idx": 3,  "ms": 250 }
            ]
        },
        "jump-down-e": {
            "frames": [
                { "idx": 10, "ms": 500 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -4 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -2 },
                { "idx": 11, "ms": 100, "px": 0.2, "oy": -1, "py": 0.4 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6, "pz": 1 },
                { "idx": 10, "ms": 250 },
                { "idx": 3,  "ms": 250 }
            ]
        },
        "jump-up-s": {
            "mirror": true,
            "frames": [
                { "idx": 10, "ms": 500 },
                { "idx": 11, "ms": 100, "px": 0.3, "pz": 1, "oy": -1 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -2 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6, "oy": -4 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.4, "oy": -2 },
                { "idx": 10, "ms": 150 },
                { "idx": 3,  "ms": 250 }
            ]
        },
        "jump-down-s": {
            "mirror": true,
            "frames": [
                { "idx": 10, "ms": 500 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -4 },
                { "idx": 11, "ms": 100, "px": 0.3, "oy": -2 },
                { "idx": 11, "ms": 100, "px": 0.2, "oy": -1, "py": 0.4 },
                { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6, "pz": 1 },
                { "idx": 10, "ms": 250 },
                { "idx": 3,  "ms": 250 }
            ]
        },
        "jump-up-w": {
            "frames": [
                { "idx": 12, "ms": 500 },
                { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "oy": -1 },
                { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "oy": -2 },
                { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -4 },
                { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -2 },
                { "idx": 12, "ms": 150 },
                { "idx": 8, "ms": 250 }
            ]
        },
        "jump-down-w": {
            "frames": [
                { "idx": 12, "ms": 500 },
                { "idx": 13, "ms": 50,  "px": 0.2, "oy": -3 },
                { "idx": 13, "ms": 50,  "px": 0.2, "oy": -6 },
                { "idx": 13, "ms": 100, "px": 0.3, "oy": -7 },
                { "idx": 13, "ms": 100, "px": 0.2, "oy": -7,            "pz": 0.1 },
                { "idx": 13, "ms": 50,  "px": 0.1, "oy": -4, "py": 0.4, "pz": 0.4 },
                { "idx": 13, "ms": 50,             "oy": -2, "py": 0.6, "pz": 0.5 },
                { "idx": 12, "ms": 250 },
                { "idx": 8, "ms": 250 }
            ]
        },
        "jump-up-n": {
            "mirror": true,
            "frames": [
                { "idx": 12, "ms": 500 },
                { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "oy": -1 },
                { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "oy": -2 },
                { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -4 },
                { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -2 },
                { "idx": 12, "ms": 150 },
                { "idx": 8, "ms": 250 }
            ]
        },
        "jump-down-n": {
            "mirror": true,
            "frames": [
                { "idx": 12, "ms": 500 },
                { "idx": 13, "ms": 50,  "px": 0.2, "oy": -3 },
                { "idx": 13, "ms": 50,  "px": 0.2, "oy": -6 },
                { "idx": 13, "ms": 100, "px": 0.3, "oy": -7 },
                { "idx": 13, "ms": 100, "px": 0.2, "oy": -7,             "pz": 0.1 },
                { "idx": 13, "ms": 50,  "px": 0.1, "oy": -4 ,"py": 0.4,  "pz": 0.4 },
                { "idx": 13, "ms": 50,             "oy": -2 ,"py": 0.6,  "pz": 0.5 },
                { "idx": 12, "ms": 250 },
                { "idx": 8, "ms": 250 }
            ]
        },
        "slash-e": {
            "frames": [
                { "idx": 20, "ms": 500, "ox": -2, "oy": -1 },
                { "idx": 21, "ms": 100, "ox": -1 },
                { "idx": 22, "ms": 500 }
            ]
        },
        "slash-s": {
            "mirror": true,
            "frames": [
                { "idx": 20, "ms": 500, "ox": 2, "oy": -1 },
                { "idx": 21, "ms": 100, "ox": 1 },
                { "idx": 22, "ms": 500 }
            ]
        }
    }
};