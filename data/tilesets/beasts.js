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
                { "idx": 1, "ms": 200 },
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
                { "idx": 1, "ms": 250 }
            ]
        },
        "move": { /* get rid of this */
            "frames": [
                { "idx": 0, "ms": 250, "px": 1, "py": 1, "pz": 1 },
                { "idx": 1, "ms": 200 }
            ]
        },
        "walk": {
            "frames": [
                // { "idx": 0, "ms": 300, "px": 0.9, "py": 0.9, "pz": 1 },
                // { "idx": 1, "ms": 200, "px": 0.1, "py": 0.1, "pz": 0 }
                { "idx": 0, "ms": 250, "px": 1, "py": 1, "pz": 1 },
                { "idx": 1, "ms": 200 }
            ]
        },
        "walk-to-slope": {
            "frames": [
                { "idx": 0, "ms": 150, "px": 0.5, "py": 0.5 },
                { "idx": 0, "ms": 250, "px": 0.5, "py": 0.5, "pz": 1 },
                { "idx": 1, "ms": 200 }
            ]
        },
        "slope-to-walk": {
            "frames": [
                { "idx": 0, "ms": 250, "px": 0.5, "py": 0.5, "pz": 1 },
                { "idx": 0, "ms": 150, "px": 0.5, "py": 0.5 },
                { "idx": 1, "ms": 200 }
            ]
        },
        "jump-to-water": {
            "frames": [
                { "idx": 1, "ms": 500 },
                { "idx": 2, "ms": 100, "oy": -2},
                { "idx": 3, "ms": 100, "oy": -6, "px": 0.5 },
                { "idx": 4, "ms": 200, "oy": -8, "px": 0.4, "pz": 0.1 },
                { "idx": 5, "ms": 100, "oy": -6, "px": 0.1, "py": 0.2, "pz": 0.1 },
                { "idx": 6, "ms": 100, "oy": -2,            "py": 0.5, "pz": 0.5 },
                { "idx": 7, "ms": 50,                       "py": 0.3, "pz": 0.3 }
            ]
        },
        "jump-down": {
            "frames": [
                { "idx": 1, "ms": 25,  "ox": 0 },
                { "idx": 1, "ms": 25,  "ox": 1 },
                { "idx": 1, "ms": 25,  "ox": 0 },
                { "idx": 1, "ms": 25,  "ox": 1 },
                { "idx": 1, "ms": 25,  "ox": 0 },
                { "idx": 1, "ms": 25,  "ox": 1 },
                { "idx": 1, "ms": 200, "ox": 0 },
                { "idx": 0, "ms": 250 }, 
                { "idx": 3, "ms": 50, "oy": -5,  "px": 0.15 },
                { "idx": 3, "ms": 50, "oy": -7,  "px": 0.15 },
                { "idx": 3, "ms": 50, "oy": -9,  "px": 0.1 },
                { "idx": 3, "ms": 50, "oy": -10, "px": 0.1 },
                { "idx": 4, "ms": 50, "oy": -11, "px": 0.1 },
                { "idx": 4, "ms": 50, "oy": -12, "px": 0.1 },
                { "idx": 4, "ms": 50, "oy": -13, "px": 0.1 },
                { "idx": 4, "ms": 50, "oy": -12, "px": 0.1 },
                { "idx": 4, "ms": 50, "oy": -11, "px": 0.05 },
                { "idx": 4, "ms": 50, "oy": -10, "px": 0.05 },
                { "idx": 4, "ms": 50, "oy": -9,  "py": 0.1, "pz": 0.1 },
                { "idx": 2, "ms": 25, "oy": -7,  "py": 0.1, "pz": 0.1 },
                { "idx": 2, "ms": 25, "oy": -5,  "py": 0.15, "pz": 0.15 },
                { "idx": 2, "ms": 25, "oy": -3,  "py": 0.15, "pz": 0.15 },
                { "idx": 6, "ms": 100,           "py": 0.5, "pz": 0.5 },
                { "idx": 1, "ms": 250 }
            ]
        },
        "jump-up": {
            "frames": [
                { "idx": 1, "ms": 25,  "ox": 0 },
                { "idx": 1, "ms": 25,  "ox": 1 },
                { "idx": 1, "ms": 25,  "ox": 0 },
                { "idx": 1, "ms": 25,  "ox": 1 },
                { "idx": 1, "ms": 25,  "ox": 0 },
                { "idx": 1, "ms": 25,  "ox": 1 },
                { "idx": 1, "ms": 200, "ox": 0 },
                { "idx": 0, "ms": 250 }, 
                { "idx": 2, "ms": 100, "oy": -3,  "py": 0.5, "pz": 0.5, "px": 0.2  },
                { "idx": 3, "ms": 100, "oy": -11, "py": 0.3, "pz": 0.3, "px": 0.2  },
                { "idx": 4, "ms": 200, "oy": -13, "py": 0.2, "pz": 0.2, "px": 0.5  },
                { "idx": 4, "ms": 150, "oy": -11, "px": 0.1 },
                { "idx": 4, "ms": 100,  "oy": -7,   },
                { "idx": 4, "ms": 50,  "oy": -1,  },
                { "idx": 1, "ms": 250 }
            ]
        },
        "attack": {
            "frames": [
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": 0  },
                { "idx": 1,  "ms": 25,  "x": 0 },
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
        },
        "meteor": {
            "frames": [
                { "idx": 0, "ms": 500,  "ox": 0 },
                { "idx": 1, "ms": 200,  "ox": 0 },
                { "idx": 1, "ms": 100,  "ox": -1 },
                { "idx": 1, "ms": 100,  "ox": 0 },
                { "idx": 1, "ms": 100,  "ox": 1 },
                { "idx": 1, "ms": 100,  "ox": 0 },
                { "idx": 1, "ms": 100,  "ox": 1 },
                { "idx": 1, "ms": 75,  "ox": 0 },
                { "idx": 1, "ms": 75,  "ox": 1 },
                { "idx": 1, "ms": 75,  "ox": 0 },
                { "idx": 1, "ms": 75,  "ox": 1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50,  "ox": 1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50, "ox": 1 },
                { "idx": 1, "ms": 50, "ox": 0 },
                { "idx": 1, "ms": 50, "ox": 1 },
                { "idx": 1, "ms": 50, "ox": 0 },
                { "idx": 1, "ms": 50, "ox": 1 },
                { "idx": 1, "ms": 300, "ox": 0, "event": "launch" },
                { "idx": 18, "ms": 50, "oy": -5 },
                { "idx": 19, "ms": 40, "oy": -15 },
                { "idx": 20, "ms": 30, "oy": -40 },
                { "idx": -1, "ms": 10, "px": 1, "py": 1, "pz": 1 },
                { "idx": -1, "ms": 1500 },
                { "idx": 23, "ms": 10, "oy": -70 },
                { "idx": 23, "ms": 10, "oy": -65 },
                { "idx": 23, "ms": 10, "oy": -60 },
                { "idx": 23, "ms": 10, "oy": -55 },
                { "idx": 23, "ms": 10, "oy": -50 },
                { "idx": 23, "ms": 10, "oy": -45 },
                { "idx": 23, "ms": 10, "oy": -40 },
                { "idx": 23, "ms": 10, "oy": -35 },
                { "idx": 23, "ms": 10, "oy": -30 },
                { "idx": 23, "ms": 10, "oy": -25 },
                { "idx": 23, "ms": 10, "oy": -20 },
                { "idx": 23, "ms": 10, "oy": -15 },
                { "idx": 23, "ms": 10, "oy": -10 },
                { "idx": 22, "ms": 10, "oy": -5, "event": "crash" },
                { "idx": 16, "ms": 200 },
                { "idx": 1,  "ms": 450 }
            ]
        },
        "meteor2": {
            "frames": [
                { "idx": 0, "ms": 500,  "ox": 0 },
                { "idx": 1, "ms": 50,  "ox": 1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50,  "ox": -1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50,  "ox": 1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50,  "ox": 1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50,  "ox": -1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50,  "ox": 1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50, "ox": 1 },
                { "idx": 1, "ms": 50, "ox": 0 },
                { "idx": 1, "ms": 50, "ox": 1 },
                { "idx": 1, "ms": 50, "ox": 0 },
                { "idx": 1, "ms": 50, "ox": 1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50,  "ox": 1 },
                { "idx": 1, "ms": 50,  "ox": 0 },
                { "idx": 1, "ms": 50, "ox": 1 },
                { "idx": 1, "ms": 50, "ox": 0 },
                { "idx": 1, "ms": 50, "ox": 1 },
                { "idx": 1, "ms": 50, "ox": 0 },
                { "idx": 1, "ms": 50, "ox": 1 },
                { "idx": 1, "ms": 1000, "ox": 0, "event": "launch" },
                { "idx": 18, "ms": 50, "oy": -5 },
                { "idx": 19, "ms": 40, "oy": -15 },
                { "idx": 20, "ms": 30, "oy": -40 },
                { "idx": -1, "ms": 10, "px": 1, "py": 1, "pz": 1 },
                { "idx": -1, "ms": 2000 },
                { "idx": 23, "ms": 10, "oy": -70 },
                { "idx": 23, "ms": 10, "oy": -65 },
                { "idx": 23, "ms": 10, "oy": -60 },
                { "idx": 23, "ms": 10, "oy": -55 },
                { "idx": 23, "ms": 10, "oy": -50 },
                { "idx": 23, "ms": 10, "oy": -45 },
                { "idx": 23, "ms": 10, "oy": -40 },
                { "idx": 23, "ms": 10, "oy": -35 },
                { "idx": 23, "ms": 10, "oy": -30 },
                { "idx": 23, "ms": 10, "oy": -25 },
                { "idx": 23, "ms": 10, "oy": -20 },
                { "idx": 23, "ms": 10, "oy": -15 },
                { "idx": 23, "ms": 10, "oy": -10 },
                { "idx": 22, "ms": 10, "oy": -5, "event": "crash2" },
                { "idx": -1, "ms": 10000 }
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
            "movement": true,
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
            "movement": true,
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
        },
        "impact": {
            "frames": [
                { "idx": 0, "ms": 100, "oy": -8 },
                { "idx": 0, "ms": 50, "oy": -10 },
                { "idx": 0, "ms": 150, "oy": -12 },
                { "idx": 0, "ms": 100, "oy": -9 },
                { "idx": 0, "ms": 50, "oy": -5 }
            ]
        },
        "intro": {
            "frames": [
                { "idx": 0, "ms": 2000 },
                { "idx": 1, "ms": 1000 },
                { "idx": 0, "ms": 300 },
                { "idx": 1, "ms": 500 },
                { "idx": 2, "ms": 150 },
                { "idx": 3, "ms": 150 },
                { "idx": 5, "ms": 3000 }
            ]
        }

    }
};

GAME_DATA.tilesets.beasts['player'] = {
    "src": "player.png",
    "measurements": {
        "sprite": {
            "height": 48,
            "width": 32
        }
    },
    "config": {
        "idle": {
            "frames": [
                { "idx": 0, "ms": 2000 }
            ]
        },
        "idle-s": {
            "frames": [
                { "idx": 0, "ms": 2000 }
            ]
        },
        "idle-e": {
            "frames": [
                { "idx": 1, "ms": 2000 }
            ]
        },
        "move": {
            "frames": [
                { "idx": 2, "ms": 125, "p": 0.25 },
                { "idx": 3, "ms": 125, "p": 0.25 },
                { "idx": 2, "ms": 125, "p": 0.25 },
                { "idx": 3, "ms": 125, "p": 0.25 }
            ]
        },
        "impact": {
            "frames": [
                { "idx": 0, "ms": 50, "oy": -5 },
                { "idx": 0, "ms": 10, "oy": -7 },
                { "idx": 0, "ms": 10, "oy": -9 },
                { "idx": 0, "ms": 10, "oy": -12 },
                { "idx": 0, "ms": 10, "oy": -15 },
                { "idx": 0, "ms": 10, "oy": -18 },
                { "idx": 0, "ms": 10, "oy": -22 },
                { "idx": -1, "ms": 5000 }
            ]
        }
    }
};



// GAME_DATA.tilesets.beasts['player2'] = {
//     "src": "player-styles.png",
//     "measurements": {
//         "sprite": {
//             "height": 48,
//             "width": 32
//         }
//     },
//     "config": {
//         "idle": {
//             "oy": -5,
//             "frames": [
//                 { "idx": 1, "ms": 2000 }
//             ]
//         },
//         "move": {
//             "frames": [
//                 { "idx": 2, "ms": 125, "p": 0.25 },
//                 { "idx": 3, "ms": 125, "p": 0.25 },
//                 { "idx": 2, "ms": 125, "p": 0.25 },
//                 { "idx": 3, "ms": 125, "p": 0.25 }
//             ]
//         }
//     }
// };

// GAME_DATA.tilesets.beasts['player3'] = {
//     "src": "player-styles.png",
//     "measurements": {
//         "sprite": {
//             "height": 48,
//             "width": 32
//         }
//     },
//     "config": {
//         "idle": {
//             "oy": -5,
//             "frames": [
//                 { "idx": 2, "ms": 2000 }
//             ]
//         },
//         "move": {
//             "frames": [
//                 { "idx": 2, "ms": 125, "p": 0.25 },
//                 { "idx": 3, "ms": 125, "p": 0.25 },
//                 { "idx": 2, "ms": 125, "p": 0.25 },
//                 { "idx": 3, "ms": 125, "p": 0.25 }
//             ]
//         }
//     }
// };

// GAME_DATA.tilesets.beasts['player4'] = {
//     "src": "player-styles.png",
//     "measurements": {
//         "sprite": {
//             "height": 48,
//             "width": 32
//         }
//     },
//     "config": {
//         "idle": {
//             "oy": -5,
//             "frames": [
//                 { "idx": 3, "ms": 2000 }
//             ]
//         },
//         "move": {
//             "frames": [
//                 { "idx": 2, "ms": 125, "p": 0.25 },
//                 { "idx": 3, "ms": 125, "p": 0.25 },
//                 { "idx": 2, "ms": 125, "p": 0.25 },
//                 { "idx": 3, "ms": 125, "p": 0.25 }
//             ]
//         }
//     }
// };

// GAME_DATA.tilesets.beasts['player5'] = {
//     "src": "player-styles.png",
//     "measurements": {
//         "sprite": {
//             "height": 48,
//             "width": 32
//         }
//     },
//     "config": {
//         "idle": {
//             "oy": -5,
//             "frames": [
//                 { "idx": 4, "ms": 2000 }
//             ]
//         },
//         "move": {
//             "frames": [
//                 { "idx": 2, "ms": 125, "p": 0.25 },
//                 { "idx": 3, "ms": 125, "p": 0.25 },
//                 { "idx": 2, "ms": 125, "p": 0.25 },
//                 { "idx": 3, "ms": 125, "p": 0.25 }
//             ]
//         }
//     }
// };