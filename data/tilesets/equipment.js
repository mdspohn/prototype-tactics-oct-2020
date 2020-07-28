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
        0: {
            0: { "layer": -1, "idx": 1, "ox": 6, "oy": 10 },
            1: { "layer": 1,  "idx": 0, "ox": 5, "oy": 12 }
        },
        1: {
            0: { "layer": -1, "idx": 1, "ox": 6, "oy": 11 },
            1: { "layer": 1,  "idx": 0, "ox": 5, "oy": 13 }
        },
        2: {
            0: { "layer": -1, "idx": 1, "ox": 6, "oy": 10 },
            1: { "layer": 1,  "idx": 0, "ox": 5, "oy": 12 }
        },
        3: {
            0: { "layer": -1, "idx": 1, "ox": 5, "oy": 10 },
            1: { "layer": 1,  "idx": 0, "ox": 4, "oy": 12 }
        },
        4: {
            0: { "layer": -1, "idx": 1, "ox": 5, "oy": 11 },
            1: { "layer": 1,  "idx": 0, "ox": 4, "oy": 13 }
        },
        5: {
            0: { "layer": 1,  "idx": 0, "ox": -7, "oy": 13, "mirrored": true },
            1: { "layer": -1, "idx": 1, "ox": -5, "oy": 10 }
        },
        6: {
            0: {"layer": 1,  "idx": 0, "ox": -7, "oy": 14, "mirrored": true },
            1: { "layer": -1, "idx": 1, "ox": -5, "oy": 11 }
        },
        7: {
            0: { "layer": 1,  "idx": 0, "ox": -7, "oy": 13, "mirrored": true },
            1: { "layer": -1, "idx": 1, "ox": -5, "oy": 10 }
        },
        8: {
            0: { "layer": 1,  "idx": 0, "ox": -6, "oy": 13, "mirrored": true },
            1: { "layer": -1, "idx": 1, "ox": -4, "oy": 10 }
        },
        9: {
            0: { "layer": 1,  "idx": 0, "ox": -6, "oy": 14, "mirrored": true },
            1: { "layer": -1, "idx": 1, "ox": -4, "oy": 11 }
        },
        10: {
            0: { "layer": -1, "idx": 1, "ox": 6, "oy": 13 },
            1: { "layer": 1,  "idx": 0, "ox": 5, "oy": 15 }
        },
        11: {
            0: { "layer": -1, "idx": 1, "ox": 6, "oy": 10 },
            1: { "layer": 1,  "idx": 0, "ox": 5, "oy": 12 }
        },
        12: {
            0: { "layer": 1,  "idx": 0, "ox": -8, "oy": 16, "mirrored": true },
            1: { "layer": -1, "idx": 1, "ox": -6, "oy": 13 }
        },
        13: {
            0: { "layer": 1,  "idx": 0, "ox": -8, "oy": 13, "mirrored": true },
            1: { "layer": -1, "idx": 1, "ox": -5, "oy": 12 }
        }
    }
};

GAME_DATA.tilesets.equipment['armor'] = {
    "src": "armor.png",
    "measurements": {
        "sprite": {
            "height": 32,
            "width": 32
        }
    },
    "config": {
        0: {
            0: { "layer": 1,  "idx": 0, "oy": 16 },
            1: { "layer": 1,  "idx": 0, "oy": 16, "mirrored": true }
        },
        1: {
            0: { "layer": 1,  "idx": 1, "oy": 16 },
            1: { "layer": 1,  "idx": 1, "oy": 16, "mirrored": true }
        },
        2: {
            0: { "layer": 1,  "idx": 2, "oy": 16 },
            1: { "layer": 1,  "idx": 2, "oy": 16, "mirrored": true }
        },
        3: {
            0: { "layer": 1,  "idx": 3, "oy": 16 },
            1: { "layer": 1,  "idx": 3, "oy": 16, "mirrored": true }
        },
        4: {
            0: { "layer": 1,  "idx": 4, "oy": 16 },
            1: { "layer": 1,  "idx": 4, "oy": 16, "mirrored": true }
        },
        5: {
            0: { "layer": 1,  "idx": 5, "oy": 16 },
            1: { "layer": 1,  "idx": 5, "oy": 16, "mirrored": true }
        },
        6: {
            0: { "layer": 1,  "idx": 6, "oy": 16 },
            1: { "layer": 1,  "idx": 6, "oy": 16, "mirrored": true }
        },
        7: {
            0: { "layer": 1,  "idx": 7, "oy": 16 },
            1: { "layer": 1,  "idx": 7, "oy": 16, "mirrored": true }
        },
        8: {
            0: { "layer": 1,  "idx": 8, "oy": 16 },
            1: { "layer": 1,  "idx": 8, "oy": 16, "mirrored": true }
        },
        9: {
            0: { "layer": 1,  "idx": 9, "oy": 16 },
            1: { "layer": 1,  "idx": 9, "oy": 16, "mirrored": true }
        },
        10: {
            0: { "layer": 1,  "idx": 10, "oy": 16 },
            1: { "layer": 1,  "idx": 10, "oy": 16, "mirrored": true }
        },
        11: {
            0: { "layer": 1,  "idx": 11, "oy": 16 },
            1: { "layer": 1,  "idx": 11, "oy": 16, "mirrored": true }
        },
        12: {
            0: { "layer": 1,  "idx": 12, "oy": 16 },
            1: { "layer": 1,  "idx": 12, "oy": 16, "mirrored": true }
        },
        13: {
            0: { "layer": 1,  "idx": 13, "oy": 16 },
            1: { "layer": 1,  "idx": 13, "oy": 16, "mirrored": true }
        }
    }
};


GAME_DATA.tilesets.equipment['hair-pins'] = {
    "src": "headgear.png",
    "measurements": {
        "sprite": {
            "height": 32,
            "width": 32
        }
    },
    "config": {
        0: {
            0: { "layer": 1,  "idx": 0, "ox": -3, "oy": -5 },
            1: { "layer": -1, "idx": 0, "ox": 0,  "oy": -9 }
        },
        1: {
            0: { "layer": 1,  "idx": 0, "ox": -3, "oy": -4 },
            1: { "layer": -1, "idx": 0, "ox": 0,  "oy": -8 }
        },
        2: {
            0: { "layer": 1,  "idx": 0, "ox": -3, "oy": -5 },
            1: { "layer": -1, "idx": 0, "ox": 0,  "oy": -9 }
        },
        3: {
            0: { "layer": 1,  "idx": 0, "ox": -3, "oy": -5 },
            1: { "layer": -1, "idx": 0, "ox": 0,  "oy": -9 }
        },
        4: {
            0: { "layer": 1,  "idx": 0, "ox": -3, "oy": -4 },
            1: { "layer": -1, "idx": 0, "ox": 0,  "oy": -8 }
        },
        5: {
            0: { "layer": -1, "idx": 0, "ox": 5, "oy": -7 },
            1: { "layer": 1,  "idx": 0, "ox": 3, "oy": -4 }
        },
        6: {
            0: { "layer": -1, "idx": 0, "ox": 5, "oy": -6 },
            1: { "layer": 1,  "idx": 0, "ox": 3, "oy": -3 }
        },
        7: {
            0: { "layer": -1, "idx": 0, "ox": 5, "oy": -7 },
            1: { "layer": 1,  "idx": 0, "ox": 3, "oy": -4 }
        },
        8: {
            0: { "layer": -1, "idx": 0, "ox": 5, "oy": -7 },
            1: { "layer": 1,  "idx": 0, "ox": 3, "oy": -4 }
        },
        9: {
            0: { "layer": -1, "idx": 0, "ox": 5, "oy": -6 },
            1: { "layer": 1,  "idx": 0, "ox": 3, "oy": -3 }
        },
        10: {
            0: { "layer": 1,  "idx": 0, "ox": -3, "oy": -2 },
            1: { "layer": -1, "idx": 0, "ox": 0,  "oy": -6 }
        },
        11: {
            0: { "layer": 1,  "idx": 0, "ox": -3, "oy": -5 },
            1: { "layer": -1, "idx": 0, "ox": 0,  "oy": -9 }
        },
        12: {
            0: { "layer": -1, "idx": 0, "ox": 5, "oy": -4 },
            1: { "layer": 1,  "idx": 0, "ox": 3, "oy": -1 }
        },
        13: {
            0: { "layer": -1, "idx": 0, "ox": 5, "oy": -7 },
            1: { "layer": 1,  "idx": 0, "ox": 3, "oy": -4 }
        }
    }
};