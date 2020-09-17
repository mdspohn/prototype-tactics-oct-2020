// -----------------
// FRAME PROPERTIES
// --------------------------
// REQUIRED ----------------------------------------------
// @idx <Int> - img index to render
// @ms  <Int> - time in milliseconds of frame

// OPTIONAL ---------------------------------------------
// @px <Float 0-1>  - % of x-axis progress to destination
// @py <Float 0-1>  - % of y-axis progress to destination
// @pz <Float 0-1>  - % of z-axis progress to destination
// @ox <Int>        - x offset (multiplied by scaling of renderer)
// @oy <Int>        - y offset (multiplied by scaling of renderer)
// @intx <Int>      - interpolated x offset (multiplied by scaling of renderer)
// @inty <Int>      - interpolated y offset (multiplied by scaling of renderer)
// @xmult <Boolean> - whether @ms should be multiplied based on x-difference of destination
// @ymult <Boolean> - whether @ms should be multiplied based on y-difference of destination
// @zmult <Boolean> - whether @ms should be multiplied based on z-difference of destination
// @event <String>  - event that should fire after frame
// -----------------------------------------------------------------------------------------------

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
                    { "idx": 10, "ms": 250, "zmult": true },
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
                    { "idx": 10, "ms": 250, "zmult": true },
                    { "idx": 11, "ms": 100, "px": 0.3, "pz": 1 },
                    { "idx": 11, "ms": 100, "px": 0.3 },
                    { "idx": 11, "ms": 100, "px": 0.2, "py": 0.6 },
                    { "idx": 11, "ms": 100, "px": 0.2, "py": 0.4 },
                    { "idx": 10, "ms": 150 },
                    { "idx": 3,  "ms": 250 }
                ]
            },
            "west": {
                "frames": [
                    { "idx": 12, "ms": 250, "zmult": true },
                    { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "inty": -1 },
                    { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "inty": -2 },
                    { "idx": 13, "ms": 100, "px": 0.2,                     "inty": -4 },
                    { "idx": 13, "ms": 100, "px": 0.2 },
                    { "idx": 12, "ms": 150 },
                    { "idx": 8,  "ms": 250 }
                ]
            },
            "north": {
                "mirrored": true,
                "frames": [
                    { "idx": 12, "ms": 250, "zmult": true },
                    { "idx": 13, "ms": 100, "px": 0.3, "py": 0.6, "pz": 1, "inty": -1 },
                    { "idx": 13, "ms": 100, "px": 0.3, "py": 0.4,          "inty": -2 },
                    { "idx": 13, "ms": 100, "px": 0.2,                     "inty": -4 },
                    { "idx": 13, "ms": 100, "px": 0.2 },
                    { "idx": 12, "ms": 150 },
                    { "idx": 8,  "ms": 250 }
                ]
            }
        },
        "jump-down": {
            "east": {
                "frames": [
                    { "idx": 10, "ms": 500 },
                    { "idx": 11, "ms": 100, "px": 0.3, "inty": -4 },
                    { "idx": 11, "ms": 100, "px": 0.3, "inty": -2 },
                    { "idx": 11, "ms": 100, "px": 0.2, "inty": -1,  "py": 0.4 },
                    { "idx": 11, "ms": 100, "px": 0.2,              "py": 0.6, "pz": 1 },
                    { "idx": 10, "ms": 250 },
                    { "idx": 3,  "ms": 250 }
                ]
            },
            "south": {
                "mirrored": true,
                "frames": [
                    { "idx": 10, "ms": 500 },
                    { "idx": 11, "ms": 100, "px": 0.3, "inty": -4 },
                    { "idx": 11, "ms": 100, "px": 0.3, "inty": -2 },
                    { "idx": 11, "ms": 100, "px": 0.2, "inty": -1, "py": 0.4 },
                    { "idx": 11, "ms": 100, "px": 0.2,            "py": 0.6, "pz": 1 },
                    { "idx": 10, "ms": 250 },
                    { "idx": 3,  "ms": 250 }
                ]
            },
            "west": {
                "frames": [
                    { "idx": 12, "ms": 500 },
                    { "idx": 13, "ms": 50,  "px": 0.2, "inty": -3 },
                    { "idx": 13, "ms": 50,  "px": 0.2, "inty": -6 },
                    { "idx": 13, "ms": 100, "px": 0.3, "inty": -7 },
                    { "idx": 13, "ms": 100, "px": 0.2, "inty": -7,            "pz": 0.1 },
                    { "idx": 13, "ms": 50,  "px": 0.1, "inty": -4, "py": 0.4, "pz": 0.4 },
                    { "idx": 13, "ms": 50,                         "py": 0.6, "pz": 0.5 },
                    { "idx": 12, "ms": 250 },
                    { "idx": 8,  "ms": 250 }
                ]
            },
            "north": {
                "mirrored": true,
                "frames": [
                    { "idx": 12, "ms": 500 },
                    { "idx": 13, "ms": 50,  "px": 0.2, "inty": -3 },
                    { "idx": 13, "ms": 50,  "px": 0.2, "inty": -6 },
                    { "idx": 13, "ms": 100, "px": 0.3, "inty": -7 },
                    { "idx": 13, "ms": 100, "px": 0.2, "inty": -7,            "pz": 0.1 },
                    { "idx": 13, "ms": 50,  "px": 0.1, "inty": -4 ,"py": 0.4, "pz": 0.4 },
                    { "idx": 13, "ms": 50,                         "py": 0.6, "pz": 0.5 },
                    { "idx": 12, "ms": 250 },
                    { "idx": 8,  "ms": 250 }
                ]
            }
        },
        "leap": {
            "east": {
                "frames": [
                    { "idx": 10, "ms": 500 },
                    { "idx": 11, "ms": 50, "inty": -3 },
                    { "idx": 11, "ms": 75, "inty": -5, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 11, "ms": 75, "inty": -7, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 11, "ms": 75, "inty": -5, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 11, "ms": 75, "inty": -3, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 11, "ms": 75,           "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 10, "ms": 150 },
                    { "idx": 3,  "ms": 250 }
                ]
            },
            "south": {
                "mirrored": true,
                "frames": [
                    { "idx": 10, "ms": 500 },
                    { "idx": 11, "ms": 50, "inty": -3 },
                    { "idx": 11, "ms": 75, "inty": -5, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 11, "ms": 75, "inty": -7, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 11, "ms": 75, "inty": -5, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 11, "ms": 75, "inty": -3, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 11, "ms": 75,           "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 10, "ms": 150 },
                    { "idx": 3,  "ms": 250 }
                ]
            },
            "west": {
                "frames": [
                    { "idx": 12, "ms": 500 },
                    { "idx": 13, "ms": 50, "inty": -3 },
                    { "idx": 13, "ms": 75, "inty": -5, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 13, "ms": 75, "inty": -7, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 13, "ms": 75, "inty": -5, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 13, "ms": 75, "inty": -3, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 13, "ms": 75,           "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 12, "ms": 150 },
                    { "idx": 8,  "ms": 250 }
                ]
            },
            "north": {
                "mirrored": true,
                "frames": [
                    { "idx": 12, "ms": 500 },
                    { "idx": 13, "ms": 50, "inty": -3 },
                    { "idx": 13, "ms": 75, "inty": -5, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 13, "ms": 75, "inty": -7, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 13, "ms": 75, "inty": -5, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 13, "ms": 75, "inty": -3, "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 13, "ms": 75,           "px": 0.2, "py": 0.2, "pz": 0.2 },
                    { "idx": 12, "ms": 150 },
                    { "idx": 8,  "ms": 250 }
                ]
            }
        },
        "slash": {
            "east": {
                "frames": [
                    { "idx": 20, "ms": 500, "ix": -4, "inty": -2 },
                    { "idx": 21, "ms": 50,  "ix": -2, "inty": -1, "px": 0.2, "py": 0.2 },
                    { "idx": 22, "ms": 200,                     "px": 0.8, "py": 0.8 },
                    { "idx": 22, "ms": 200,                     "px": 0, "py": 0 },
                    { "idx": 21, "ms": 100 },
                    { "idx": 22, "ms": 200,                     "px": 0, "py": 0 },
                    { "idx": 21, "ms": 100 },
                    { "idx": 22, "ms": 200,                     "px": 0, "py": 0 },
                    { "idx": 21, "ms": 100 },
                    { "idx": 3,  "ms": 250 }
                ]
            },
            "south": {
                "mirrored": true,
                "frames": [
                    { "idx": 20, "ms": 500, "ix": 4, "inty": -2 },
                    { "idx": 21, "ms": 50,  "ix": 2,  "inty": -1 },
                    { "idx": 22, "ms": 500 },
                    { "idx": 21, "ms": 50  },
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
            "east": {
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
            "south": {
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
            "west": {
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
            "north": {
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
        },
        "walk": {
            "east": {
                "frames": [
                    { "idx": 0, "ms": 250, "px": 1, "py": 1, "pz": 1 },
                    { "idx": 1, "ms": 200 }
                ]
            },
            "south": {
                "frames": [
                    { "idx": 0, "ms": 250, "px": 1, "py": 1, "pz": 1 },
                    { "idx": 1, "ms": 200 }
                ]
            },
            "west": {
                "frames": [
                    { "idx": 0, "ms": 250, "px": 1, "py": 1, "pz": 1 },
                    { "idx": 1, "ms": 200 }
                ]
            },
            "north": {
                "frames": [
                    { "idx": 0, "ms": 250, "px": 1, "py": 1, "pz": 1 },
                    { "idx": 1, "ms": 200 }
                ]
            },
        },
        "jump-up": {
            "east": {
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
            "south": {
                "mirrored": true,
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
            "west": {
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
            "north": {
                "mirrored": true,
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
            }
        },
        "jump-down": {
            "east": {
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
            "south": {
                "mirrored": true,
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
            "west": {
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
            "north": {
                "mirrored": true,
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
            }
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
            "east": {
                "frames": [
                    { "idx": 6, "ms": 1000 },
                    { "idx": 5, "ms": 1000 }
                ]
            },
            "south": {
                "frames": [
                    { "idx": 6, "ms": 1000 },
                    { "idx": 5, "ms": 1000 }
                ]
            },
            "west": {
                "frames": [
                    { "idx": 6, "ms": 1000 },
                    { "idx": 5, "ms": 1000 }
                ]
            },
            "north": {
                "frames": [
                    { "idx": 6, "ms": 1000 },
                    { "idx": 5, "ms": 1000 }
                ]
            },
        },
        /* -------------------------
        // EVERYTHING BELOW HERE IS PROBABLY 1 INDEX TOO LOW
        // ----------------------------------------*/
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