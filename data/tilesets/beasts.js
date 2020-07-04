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
            "animation": [
                { "id": 1, "ms": 250 },
                { "id": 0, "ms": 200 }, 
                { "id": 2, "ms": 100, "y": -1  },
                { "id": 3, "ms": 150, "y": -9  },
                { "id": 4, "ms": 250, "y": -11 },
                { "id": 4, "ms": 100, "y": -9  },
                { "id": 4, "ms": 50,  "y": -7  },
                { "id": 4, "ms": 25,  "y": -5  },
                { "id": 4, "ms": 25,  "y": -3  },
                { "id": 4, "ms": 25,  "y": 0   },
                { "id": 7, "ms": 50,  "y": 0   },
                { "id": 1, "ms": 200 }
            ]
        },
        "move": {
            "animation": [
                { "id": 0, "ms": 130, "p": 0   },
                { "id": 1, "ms": 200, "p": 0.9 },
                { "id": 0, "ms": 60,  "p": 0.1 }
            ]
        },
        "jump": {
            "animation": [
                { "id": 1, "ms": 500 },
                { "id": 2, "ms": 100, "y": -2},
                { "id": 3, "ms": 100, "y": -6, "p": 0.5,           "zu": 1 },
                { "id": 4, "ms": 200, "y": -8, "p": 0.4, "zd": 0.1 },
                { "id": 5, "ms": 100, "y": -6, "p": 0.1, "zd": 0.1 },
                { "id": 6, "ms": 100, "y": -2,           "zd": 0.5 },
                { "id": 7, "ms": 50,                     "zd": 0.3 }
            ]
        },
        "attack": {
            "animation": [
                { "id": 1,  "ms": 25,  "x": 0  },
                { "id": 1,  "ms": 25,  "x": 1  },
                { "id": 1,  "ms": 25,  "x": 0  },
                { "id": 1,  "ms": 25,  "x": -1 },
                { "id": 1,  "ms": 25,  "x": 0  },
                { "id": 1,  "ms": 25,  "x": 1  },
                { "id": 1,  "ms": 25,  "x": 0  },
                { "id": 1,  "ms": 25,  "x": -1 },
                { "id": 1,  "ms": 25,  "x": 0  },
                { "id": 1,  "ms": 25,  "x": 1  },
                { "id": 1,  "ms": 25,  "x": 0  },
                { "id": 1,  "ms": 25,  "x": -1 },
                { "id": 1,  "ms": 25,  "x": 0  },
                { "id": 1,  "ms": 25,  "x": 1  },
                { "id": 1,  "ms": 25,  "x": 0  },
                { "id": 1,  "ms": 25,  "x": -1 },
                { "id": 1,  "ms": 200, "x": 0  },
                { "id": 10, "ms": 25,  "y": -10, "x": 2 },
                { "id": 11, "ms": 25,  "y": -13, "x": 2 },
                { "id": 12, "ms": 25,  "y": -15, "x": 2 },
                { "id": 13, "ms": 25,  "y": -17, "x": 2 },
                { "id": 10, "ms": 25,  "y": -18, "x": 2 },
                { "id": 11, "ms": 25,  "y": -19, "x": 2 },
                { "id": 12, "ms": 25,  "y": -20, "x": 2 },
                { "id": 13, "ms": 25,  "y": -21, "x": 2 },
                { "id": 10, "ms": 35,  "y": -22, "x": 2 },
                { "id": 11, "ms": 35,  "y": -23, "x": 2 },
                { "id": 12, "ms": 35,  "y": -24, "x": 2 },
                { "id": 13, "ms": 35,  "y": -25, "x": 2 },
                { "id": 10, "ms": 45,  "y": -26, "x": 2 },
                { "id": 11, "ms": 45,  "y": -27, "x": 2 },
                { "id": 12, "ms": 45,  "y": -28, "x": 2 },
                { "id": 13, "ms": 45,  "y": -29, "x": 2 },
                { "id": 10, "ms": 55,  "y": -30, "x": 2 },
                { "id": 11, "ms": 55,  "y": -30, "x": 2 },
                { "id": 12, "ms": 55,  "y": -30, "x": 2 },
                { "id": 13, "ms": 55,  "y": -30, "x": 2 },
                { "id": 10, "ms": 65,  "y": -30, "x": 3 },
                { "id": 11, "ms": 100, "y": -29, "x": 3 },
                { "id": 12, "ms": 150, "y": -27, "x": 3 },
                { "id": 13, "ms": 150, "y": -25, "x": 3, "event": "hit" },
                { "id": 17, "ms": 250, "y": -9,  "x": 8 },
                { "id": 18, "ms": 100, "y": -16, "x": 6 },
                { "id": 19, "ms": 100, "y": -20, "x": 3 },
                { "id": 19, "ms": 100, "y": -9,  "x": 2 },
                { "id": 19, "ms": 100, "y": -4,  "x": 1 },
                { "id": 1,  "ms": 100 }
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
            "animation": [
                { "id": 5, "ms": 1000 },
                { "id": 4, "ms": 1000 }
            ]
        },
        "move": {
            "animation": [
                { "id": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "id": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "id": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "id": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "id": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "id": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "id": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "id": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "id": 5, "ms": 25, "p": 0.05, "x": 1  },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  },
                { "id": 5, "ms": 25, "p": 0.05, "x": -1 },
                { "id": 5, "ms": 25, "p": 0.05, "x": 0  }
            ]
        },
        "jump": {
            "animation": [
                { "id": 3, "ms": 200, "p": .5, "zu": 1 },
                { "id": 4, "ms": 200, "p": .5, "zd": 1 }
            ]
        },
        "defend": {
            "animation": [
                { "id": 0, "ms": 1000 },
                { "id": 1, "ms": 300 },
                { "id": 0, "ms": 400 },
                { "id": 1, "ms": 100 },
                { "id": 4, "ms": 200 }
            ]
        }
    }
};