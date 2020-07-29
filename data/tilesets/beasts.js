
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
            "east": {
                "frames": [
                    { "idx": 2, "ms": 125 },
                    { "idx": 1, "ms": 250 },
                    { "idx": 2, "ms": 125 }
                ],
                "variation": [
                    { "idx": 3, "ms": 125 },
                    { "idx": 4, "ms": 250 },
                    { "idx": 3, "ms": 125 }
                ]
            },
            "south": {
                "mirrored": true,
                "frames": [
                    { "idx": 2, "ms": 125 },
                    { "idx": 1, "ms": 250 },
                    { "idx": 2, "ms": 125 }
                ],
                "variation": [
                    { "idx": 3, "ms": 125 },
                    { "idx": 4, "ms": 250 },
                    { "idx": 3, "ms": 125 }
                ]
            },
            "west": {
                "frames": [
                    { "idx": 7, "ms": 125 },
                    { "idx": 6, "ms": 250 },
                    { "idx": 7, "ms": 125 }
                ],
                "variation": [
                    { "idx": 8, "ms": 125 },
                    { "idx": 9, "ms": 250 },
                    { "idx": 8, "ms": 125 }
                ]
            },
            "north": {
                "mirrored": true,
                "frames": [
                    { "idx": 7, "ms": 125 },
                    { "idx": 6, "ms": 250 },
                    { "idx": 7, "ms": 125 }
                ],
                "variation": [
                    { "idx": 8, "ms": 125 },
                    { "idx": 9, "ms": 250 },
                    { "idx": 8, "ms": 125 }
                ]
            },
        },
        "walk": {
            "east": {
                "frames": [
                    { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                    { "idx": 1, "ms": 250, "px": .5,  "py": .5,  "pz": .50, "oy": -1 },
                    { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 }
                ],
                "variation": [
                    { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                    { "idx": 4, "ms": 250, "px": .5,  "py": .5,  "pz": .50, "oy": -1 },
                    { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 }
                ]
            },
            "south": {
                "mirrored": true,
                "frames": [
                    { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                    { "idx": 1, "ms": 250, "px": .5,  "py": .5,  "pz": .50, "oy": -1 },
                    { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 }
                ],
                "variation": [
                    { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                    { "idx": 4, "ms": 250, "px": .5,  "py": .5,  "pz": .50, "oy": -1 },
                    { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 }
                ]
            },
            "west": {
                "frames": [
                    { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                    { "idx": 6, "ms": 250, "px": .5,  "py": .5,  "pz": .50, "oy": -1 },
                    { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 }
                ],
                "variation": [
                    { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                    { "idx": 9, "ms": 250, "px": .5,  "py": .5,  "pz": .50, "oy": -1 },
                    { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 }
                ]
            },
            "north": {
                "mirrored": true,
                "frames": [
                    { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                    { "idx": 6, "ms": 250, "px": .5,  "py": .5,  "pz": .50, "oy": -1 },
                    { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 }
                ],
                "variation": [
                    { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 },
                    { "idx": 9, "ms": 250, "px": .5,  "py": .5,  "pz": .50, "oy": -1 },
                    { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 }
                ]
            },
        },
        "jump-up": {
            "east": {
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
            "south": {
                "mirrored": true,
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
            "west": {
                "frames": [
                    { "idx": 12, "ms": 500 },
                    { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "oy": -1 },
                    { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "oy": -2 },
                    { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -4 },
                    { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -2 },
                    { "idx": 12, "ms": 150 },
                    { "idx": 8,  "ms": 250 }
                ]
            },
            "north": {
                "mirrored": true,
                "frames": [
                    { "idx": 12, "ms": 500 },
                    { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "oy": -1 },
                    { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "oy": -2 },
                    { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -4 },
                    { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -2 },
                    { "idx": 12, "ms": 150 },
                    { "idx": 8,  "ms": 250 }
                ]
            }
        },
        "jump-down": {
            "east": {
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
            "south": {
                "mirrored": true,
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
            "west": {
                "frames": [
                    { "idx": 12, "ms": 500 },
                    { "idx": 13, "ms": 50,  "px": 0.2, "oy": -3 },
                    { "idx": 13, "ms": 50,  "px": 0.2, "oy": -6 },
                    { "idx": 13, "ms": 100, "px": 0.3, "oy": -7 },
                    { "idx": 13, "ms": 100, "px": 0.2, "oy": -7,            "pz": 0.1 },
                    { "idx": 13, "ms": 50,  "px": 0.1, "oy": -4, "py": 0.4, "pz": 0.4 },
                    { "idx": 13, "ms": 50,             "oy": -2, "py": 0.6, "pz": 0.5 },
                    { "idx": 12, "ms": 250 },
                    { "idx": 8,  "ms": 250 }
                ]
            },
            "north": {
                "mirrored": true,
                "frames": [
                    { "idx": 12, "ms": 500 },
                    { "idx": 13, "ms": 50,  "px": 0.2, "oy": -3 },
                    { "idx": 13, "ms": 50,  "px": 0.2, "oy": -6 },
                    { "idx": 13, "ms": 100, "px": 0.3, "oy": -7 },
                    { "idx": 13, "ms": 100, "px": 0.2, "oy": -7,             "pz": 0.1 },
                    { "idx": 13, "ms": 50,  "px": 0.1, "oy": -4 ,"py": 0.4,  "pz": 0.4 },
                    { "idx": 13, "ms": 50,             "oy": -2 ,"py": 0.6,  "pz": 0.5 },
                    { "idx": 12, "ms": 250 },
                    { "idx": 8,  "ms": 250 }
                ]
            }
        },
        "slash": {
            "east": {
                "frames": [
                    { "idx": 20, "ms": 500, "ox": -4, "oy": -2 },
                    { "idx": 21, "ms": 50, "ox": -2, "oy": -1, "px": 0.2, "py": 0.2 },
                    { "idx": 22, "ms": 200, "px": 0.8, "py": 0.8 },
                    { "idx": 22, "ms": 200, "px": 0, "py": 0 },
                    { "idx": 21, "ms": 100 },
                    { "idx": 22, "ms": 200, "px": 0, "py": 0 },
                    { "idx": 21, "ms": 100 },
                    { "idx": 22, "ms": 200, "px": 0, "py": 0 },
                    { "idx": 21, "ms": 100 },
                    { "idx": 3,  "ms": 250 }
                ]
            },
            "south": {
                "mirrored": true,
                "frames": [
                    { "idx": 20, "ms": 500, "ox": 4, "oy": -2 },
                    { "idx": 21, "ms": 50, "ox": 2, "oy": -1 },
                    { "idx": 22, "ms": 500 },
                    { "idx": 21, "ms": 50 },
                    { "idx": 3,  "ms": 250 }
                ]
            },
            "west": {
                "frames": [

                ]
            },
            "north": {
                "mirrored": true,
                "frames": [

                ]
            }
        }
    }
};

//         "jump-up-e": {
//             "frames": [
//                 { "idx": 10, "ms": 500 },
//                 { "idx": 11, "ms": 100, "px": 0.3, "pz": 1 },
//                 { "idx": 11, "ms": 100, "px": 0.2 },
//                 { "idx": 11, "ms": 50,  "px": 0.1 },
//                 { "idx": 11, "ms": 100, "px": 0.2, "py": 0.25 },
//                 { "idx": 11, "ms": 100, "px": 0.2, "py": 0.75 },
//                 { "idx": 10, "ms": 150 },
//                 { "idx": 3,  "ms": 250 }
//             ]
//         },
//         "jump-down-e": {
//             "frames": [
//                 { "idx": 10, "ms": 500 },
//                 { "idx": 11, "ms": 100, "px": 0.3, "oy": -4 },
//                 { "idx": 11, "ms": 100, "px": 0.3, "oy": -2 },
//                 { "idx": 11, "ms": 100, "px": 0.2, "oy": -1, "py": 0.4 },
//                 { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6, "pz": 1 },
//                 { "idx": 10, "ms": 250 },
//                 { "idx": 3,  "ms": 250 }
//             ]
//         },
//         "jump-up-s": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 10, "ms": 500 },
//                 { "idx": 11, "ms": 100, "px": 0.3, "pz": 1, "oy": -1 },
//                 { "idx": 11, "ms": 100, "px": 0.3, "oy": -2 },
//                 { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6, "oy": -4 },
//                 { "idx": 11, "ms": 100, "px": 0.2, "py": 0.4, "oy": -2 },
//                 { "idx": 10, "ms": 150 },
//                 { "idx": 3,  "ms": 250 }
//             ]
//         },
//         "jump-down-s": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 10, "ms": 500 },
//                 { "idx": 11, "ms": 100, "px": 0.3, "oy": -4 },
//                 { "idx": 11, "ms": 100, "px": 0.3, "oy": -2 },
//                 { "idx": 11, "ms": 100, "px": 0.2, "oy": -1, "py": 0.4 },
//                 { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6, "pz": 1 },
//                 { "idx": 10, "ms": 250 },
//                 { "idx": 3,  "ms": 250 }
//             ]
//         },
//         "jump-up-w": {
//             "frames": [
//                 { "idx": 12, "ms": 500 },
//                 { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "oy": -1 },
//                 { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "oy": -2 },
//                 { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -4 },
//                 { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -2 },
//                 { "idx": 12, "ms": 150 },
//                 { "idx": 8,  "ms": 250 }
//             ]
//         },
//         "jump-down-w": {
//             "frames": [
//                 { "idx": 12, "ms": 500 },
//                 { "idx": 13, "ms": 50,  "px": 0.2, "oy": -3 },
//                 { "idx": 13, "ms": 50,  "px": 0.2, "oy": -6 },
//                 { "idx": 13, "ms": 100, "px": 0.3, "oy": -7 },
//                 { "idx": 13, "ms": 100, "px": 0.2, "oy": -7,            "pz": 0.1 },
//                 { "idx": 13, "ms": 50,  "px": 0.1, "oy": -4, "py": 0.4, "pz": 0.4 },
//                 { "idx": 13, "ms": 50,             "oy": -2, "py": 0.6, "pz": 0.5 },
//                 { "idx": 12, "ms": 250 },
//                 { "idx": 8,  "ms": 250 }
//             ]
//         },
//         "jump-up-n": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 12, "ms": 500 },
//                 { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "oy": -1 },
//                 { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "oy": -2 },
//                 { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -4 },
//                 { "idx": 13, "ms": 100, "px": 0.2,                     "oy": -2 },
//                 { "idx": 12, "ms": 150 },
//                 { "idx": 8,  "ms": 250 }
//             ]
//         },
//         "jump-down-n": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 12, "ms": 500 },
//                 { "idx": 13, "ms": 50,  "px": 0.2, "oy": -3 },
//                 { "idx": 13, "ms": 50,  "px": 0.2, "oy": -6 },
//                 { "idx": 13, "ms": 100, "px": 0.3, "oy": -7 },
//                 { "idx": 13, "ms": 100, "px": 0.2, "oy": -7,             "pz": 0.1 },
//                 { "idx": 13, "ms": 50,  "px": 0.1, "oy": -4 ,"py": 0.4,  "pz": 0.4 },
//                 { "idx": 13, "ms": 50,             "oy": -2 ,"py": 0.6,  "pz": 0.5 },
//                 { "idx": 12, "ms": 250 },
//                 { "idx": 8,  "ms": 250 }
//             ]
//         },
//         "slash-e": {
//             "frames": [
//                 { "idx": 20, "ms": 500, "ox": -2, "oy": -1 },
//                 { "idx": 21, "ms": 100, "ox": -1 },
//                 { "idx": 22, "ms": 500 }
//             ]
//         },
//         "slash-s": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 20, "ms": 500, "ox": 2, "oy": -1 },
//                 { "idx": 21, "ms": 100, "ox": 1 },
//                 { "idx": 22, "ms": 500 }
//             ]
//         },

//         "idle-e": {
//             "frames": [
//                 { "idx": 3, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 4, "ms": 250, "px": .25,  "py": .25,  "pz": .50 },
//                 { "idx": 3, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 2, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 1, "ms": 250, "px": .25,  "py": .25,  "pz": .50 },
//                 { "idx": 2, "ms": 125, "px": .125, "py": .125 },
//             ]
//         },
//         "idle-s": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 3, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 4, "ms": 250, "px": .25,  "py": .25,  "pz": .50 },
//                 { "idx": 3, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 2, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 1, "ms": 250, "px": .25,  "py": .25,  "pz": .50 },
//                 { "idx": 2, "ms": 125, "px": .125, "py": .125 },
//             ]
//         },
//         "idle-w": {
//             "frames": [
//                 { "idx": 7, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 6, "ms": 250, "px": .25,  "py": .25 },
//                 { "idx": 7, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 8, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 9, "ms": 250, "px": .25,  "py": .25 },
//                 { "idx": 8, "ms": 125, "px": .125, "py": .125 }
//             ]
//         },
//         "idle-n": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 7, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 6, "ms": 250, "px": .25,  "py": .25 },
//                 { "idx": 7, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 8, "ms": 125, "px": .125, "py": .125 },
//                 { "idx": 9, "ms": 250, "px": .25,  "py": .25 },
//                 { "idx": 8, "ms": 125, "px": .125, "py": .125 }
//             ]
//         },
//         "walk-e-0": {
//             "frames": [
//                 { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 },
//                 { "idx": 1, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
//                 { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 }
//             ]
//         },
//         "walk-e-1": {
//             "frames": [
//                 { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 },
//                 { "idx": 4, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
//                 { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 }
//             ]
//         },
//         "walk-s-0": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 },
//                 { "idx": 1, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
//                 { "idx": 2, "ms": 125, "px": .25, "py": .25, "pz": .25 }
//             ]
//         },
//         "walk-s-1": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 },
//                 { "idx": 4, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
//                 { "idx": 3, "ms": 125, "px": .25, "py": .25, "pz": .25 }
//             ]
//         },
//         "walk-w-0": {
//             "frames": [
//                 { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 },
//                 { "idx": 6, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
//                 { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 }
//             ]
//         },
//         "walk-w-1": {
//             "frames": [
//                 { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 },
//                 { "idx": 9, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
//                 { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 }
//             ]
//         },
//         "walk-n-0": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 },
//                 { "idx": 6, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
//                 { "idx": 7, "ms": 125, "px": .25, "py": .25, "pz": .25 }
//             ]
//         },
//         "walk-n-1": {
//             "mirror": true,
//             "frames": [
//                 { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 },
//                 { "idx": 9, "ms": 250, "px": .5,  "py": .5,  "pz": .50 },
//                 { "idx": 8, "ms": 125, "px": .25, "py": .25, "pz": .25 }
//             ]
//         },
//     }
// };

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
        "walk": {
            "frames": [
                // { "idx": 0, "ms": 300, "px": 0.9, "py": 0.9, "pz": 1 },
                // { "idx": 1, "ms": 200, "px": 0.1, "py": 0.1, "pz": 0 }
                { "idx": 0, "ms": 250, "px": 1, "py": 1, "pz": 1 },
                { "idx": 1, "ms": 200 }
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