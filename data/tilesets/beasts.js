if (GAME_DATA.tilesets == undefined)
    GAME_DATA.tilesets = new Object();

GAME_DATA.tilesets.beasts = new Object();
GAME_DATA.tilesets.beasts['slime'] = {
    "src": "slime.png",
    "measurements": {
        "sprite": {
            "height": 32,
            "width": 32
        }
    },
    "config": {
        "idle": {
            "frames": [
                { "idx": 1, "ms": 250 },
                { "idx": 0, "ms": 200 }, 
                { "idx": 2, "ms": 100, "oy": -1  },
                { "idx": 3, "ms": 150, "oy": -9  },
                { "idx": 4, "ms": 250, "oy": -11 },
                { "idx": 4, "ms": 100, "oy": -9  },
                { "idx": 4, "ms": 50,  "oy": -7  },
                { "idx": 4, "ms": 25,  "oy": -5  },
                { "idx": 4, "ms": 25,  "oy": -3  },
                { "idx": 4, "ms": 25,  "oy": 0   },
                { "idx": 7, "ms": 50,  "oy": 0   },
                { "idx": 1, "ms": 200, "next": "idle" }
            ]
        },
        "move": {
            "frames": [
                { "idx": 0, "ms": 130, "p": 0   },
                { "idx": 1, "ms": 200, "p": 0.9 },
                { "idx": 0, "ms": 60,  "p": 0.1 }
            ]
        },
        "jump": {
            "frames": [
                { "idx": 1, "ms": 500 },
                { "idx": 2, "ms": 100, "y": -2},
                { "idx": 3, "ms": 100, "y": -6, "p": 0.5,           "zu": 1 },
                { "idx": 4, "ms": 200, "y": -8, "p": 0.4, "zd": 0.1 },
                { "idx": 5, "ms": 100, "y": -6, "p": 0.1, "zd": 0.1 },
                { "idx": 6, "ms": 100, "y": -2,           "zd": 0.5 },
                { "idx": 7, "ms": 50,                     "zd": 0.3 }
            ]
        },
        "attack": {
            "frames": [
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": 1  },
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": -1 },
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": 1  },
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": -1 },
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": 1  },
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": -1 },
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": 1  },
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": -1 },
                { "idx": 1,  "ms": 200, "x": 0  },
                { "idx": 10, "ms": 25,  "y": -10, "x": 2 },
                { "idx": 11, "ms": 25,  "y": -13, "x": 2 },
                { "idx": 12, "ms": 25,  "y": -15, "x": 2 },
                { "idx": 13, "ms": 25,  "y": -17, "x": 2 },
                { "idx": 10, "ms": 25,  "y": -18, "x": 2 },
                { "idx": 11, "ms": 25,  "y": -19, "x": 2 },
                { "idx": 12, "ms": 25,  "y": -20, "x": 2 },
                { "idx": 13, "ms": 25,  "y": -21, "x": 2 },
                { "idx": 10, "ms": 35,  "y": -22, "x": 2 },
                { "idx": 11, "ms": 35,  "y": -23, "x": 2 },
                { "idx": 12, "ms": 35,  "y": -24, "x": 2 },
                { "idx": 13, "ms": 35,  "y": -25, "x": 2 },
                { "idx": 10, "ms": 45,  "y": -26, "x": 2 },
                { "idx": 11, "ms": 45,  "y": -27, "x": 2 },
                { "idx": 12, "ms": 45,  "y": -28, "x": 2 },
                { "idx": 13, "ms": 45,  "y": -29, "x": 2 },
                { "idx": 10, "ms": 55,  "y": -30, "x": 2 },
                { "idx": 11, "ms": 55,  "y": -30, "x": 2 },
                { "idx": 12, "ms": 55,  "y": -30, "x": 2 },
                { "idx": 13, "ms": 55,  "y": -30, "x": 2 },
                { "idx": 10, "ms": 65,  "y": -30, "x": 3 },
                { "idx": 11, "ms": 100, "y": -29, "x": 3 },
                { "idx": 12, "ms": 150, "y": -27, "x": 3 },
                { "idx": 13, "ms": 150, "y": -25, "x": 3, "event": "hit" },
                { "idx": 17, "ms": 250, "y": -9,  "x": 8 },
                { "idx": 18, "ms": 100, "y": -16, "x": 6 },
                { "idx": 19, "ms": 100, "y": -20, "x": 3 },
                { "idx": 19, "ms": 100, "y": -9,  "x": 2 },
                { "idx": 19, "ms": 100, "y": -4,  "x": 1 },
                { "idx": 1,  "ms": 100 }
            ]
        }
    }
};

GAME_DATA.tilesets.beasts['mimic'] = {
    "src": "mimic.png",
    "measurements": {
        "sprite": {
            "height": 32,
            "width": 32
        }
    },
    "config": {
        "idle": {
            "frames": [
                { "idx": 5, "ms": 1000 },
                { "idx": 4, "ms": 1000, "next": "idle" }
            ]
        },
        "move": {
            "frames": [
                { "idx": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "idx": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "idx": 5, "ms": 25, "p": 0.05, "x": 0  }
            ]
        },
        "jump": {
            "frames": [
                { "idx": 3, "ms": 200, "p": .5, "zu": 1 },
                { "idx": 4, "ms": 200, "p": .5, "zd": 1 }
            ]
        },
        "defend": {
            "frames": [
                { "idx": 0, "ms": 1000 },
                { "idx": 1, "ms": 300 },
                { "idx": 0, "ms": 400 },
                { "idx": 1, "ms": 100 },
                { "idx": 4, "ms": 200 }
            ]
        }
    }
};

GAME_DATA.tilesets.beasts['player'] = {
    "src": "player.png",
    "measurements": {
        "sprite": {
            "height": 32,
            "width": 32
        }
    },
    "config": {
        "idle": {
            "frames": [
                { "idx": 2, "ms": 500 },
                { "idx": 3, "ms": 500, "next": "idle" }
            ]
        },
        "move": {
            "frames": [
                { "idx": 2, "ms": 125, "p": 0.25 },
                { "idx": 3, "ms": 125, "p": 0.25 },
                { "idx": 2, "ms": 125, "p": 0.25 },
                { "idx": 3, "ms": 125, "p": 0.25 }
            ]
        }
    }
};