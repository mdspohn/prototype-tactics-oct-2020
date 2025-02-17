GAME_DATA.tilesets.maps['woodlands'] = {
    src: "woodlands.png",
    measurements: {
        sprite: {
            width: 32,
            height: 32
        },
        tile: {
            width: 32,
            depth: 16,
            height: 8
        }
    },
    configuration: {
        tiles: {
            // 0: {
            //     name: "Empty",
            //     idx: -1,
            //     unreachable: false,
            //     hazard: true,
            //     dirt: false,
            //     grass: false,
            //     water: false,
            //     slope: false,
            //     orientation: null,
            //     frames: [],
            //     ox: 0,
            //     oy: 0,
            //     reactions: {
            //        ice: 23,
            //        fire: 12,
            //        slashing: 55
            //     }
            // },
            "-1": {
                name: "Empty, Unreachable",
                idx: -1,
                oy: 8,
                unreachable: true
            },
            0: {
                name: "Empty",
                idx: -1,
                hazard: true,
            },
            1: {
                name: "Grass",
                idx: 0
            },
            2: {
                name: "Grass Slope: North",
                idx: 1,
                slope: true,
                orientation: "north"
            },
            3: {
                name: "Grass Slope: West",
                idx: 2,
                slope: true,
                orientation: "west"
            },
            4: {
                name: "Grass Slope: South",
                idx: 3,
                slope: true,
                orientation: "south"
            },
            5: {
                name: "Grass Slope: East",
                idx: 4,
                slope: true,
                orientation: "east"
            },
            6: {
                name: "Grass Ledge: North",
                idx: 5
            },
            7: {
                name: "Grass Ledge: West",
                idx: 6
            },
            8: {
                name: "Grass Ledge: Northwest",
                idx: 7
            },
            11: {
                name: "Dirt",
                idx: 10
            },
            12: {
                name: "Dirt Slope: North",
                idx: 11,
                slope: true,
                orientation: "north"
            },
            13: {
                name: "Dirt Slope: West",
                idx: 12,
                slope: true,
                orientation: "west"
            },
            14: {
                name: "Dirt Slope: South",
                idx: 13,
                slope: true,
                orientation: "south"
            },
            15: {
                name: "Dirt Slope: East",
                idx: 14,
                slope: true,
                orientation: "east"
            },
            16: {
                name: "Dirt Ledge: North",
                idx: 15
            },
            17: {
                name: "Dirt Ledge: West",
                idx: 16
            },
            18: {
                name: "Dirt Ledge: Northwest",
                idx: 17
            },
            21: {
                name: "Water",
                oy: 2,
                water: true,
                idx: 20
            },
            22: {
                name: "Water: North Contact",
                oy: 2,
                water: true,
                idx: 21
            },
            23: {
                name: "Water: West Contact",
                idx: 22,
                oy: 2,
                water: true
            },
            24: {
                name: "Water: South Contact",
                idx: 23,
                oy: 2,
                water: true
            },
            25: {
                name: "Water: Southeast Contact",
                idx: 24,
                oy: 2,
                water: true
            },
            31: {
                name: "Stone",
                idx: 30
            },
            32: {
                name: "Stone Slope: North",
                idx: 31,
                slope: true,
                orientation: "north"
            },
            33: {
                name: "Stone Slope: West",
                idx: 32,
                slope: true,
                orientation: "west"
            },
            34: {
                name: "Stone Slope: South",
                idx: 33,
                slope: true,
                orientation: "south"
            },
            35: {
                name: "Stone Slope: East",
                idx: 34,
                slope: true,
                orientation: "east"
            },
            36: {
                name: "Stone Ledge: North",
                idx: 35
            },
            37: {
                name: "Stone Ledge: West",
                idx: 36
            },
            38: {
                name: "Stone Ledge: Northwest",
                idx: 37
            },
            41: {
                name: "Dock",
                idx: 50
            },
            42: {
                name: "Hay Bale",
                idx: 51,
                oy: -1
            },
            43: {
                name: "Crate Bottom",
                idx: 52,
                oy: -1
            },
            44: {
                name: "Crate Top",
                idx: 53,
                oy: -1
            },
        },
        decorations: {
            0: {
                name: "Empty",
                idx: -1
            },
            1: {
                name: "Light Grass",
                idx: 40
            },
            2: {
                name: "Light Grass 2",
                idx: 41
            },
            3: {
                name: "Flowers",
                idx: 42
            },
            4: {
                name: "Stone Column Bottom",
                idx: 43
            },
            5: {
                name: "Stone Column Top",
                idx: 44
            },
            6: {
                name: "Dock Tie",
                idx: 45
            },
            7: {
                name: "Barrel",
                idx: 46,
                oy: -10
            },
            8: {
                name: "Barrel",
                idx: 57,
                oy: -10
            },
            9: {
                name: "Barrel",
                idx: 47,
                oy: -14
            },
            10: {
                name: "Crate",
                idx: 52,
                oy: -9
            },
            100: {
                name: "Tree 1",
                idx: 80,
                oy: -20,
                ox: 16
            },
            101: {
                name: "Tree 2",
                idx: 70,
                oy: -20,
                ox: 16
            },
            102: {
                name: "Tree 3",
                idx: 60,
                oy: -20,
                ox: 16
            },
            103: {
                name: "Tree 4",
                oy: -20,
                ox: 16,
                frames: [
                    {idx: 81, ms: 1500},
                    {idx: 83, ms: 250},
                    {idx: 84, ms: 200},
                    {idx: 85, ms: 100},
                    {idx: 81, ms: 8850}
                ]
            },
            104: {
                name: "Tree 5",
                idx: 71,
                oy: -20,
                ox: 16
            },
            105: {
                name: "Tree 6",
                oy: -20,
                ox: 16,
                idx: 61
            },
            106: {
                name: "Tree 7",
                oy: -20,
                ox: 16,
                frames: [
                    {idx: 82, ms: 900},
                    {idx: 73, ms: 250},
                    {idx: 74, ms: 150},
                    {idx: 75, ms: 200},
                    {idx: 82, ms: 9400}
                ]
            },
            107: {
                name: "Tree 8",
                oy: -20,
                ox: 16,
                frames: [
                    {idx: 63, ms: 250},
                    {idx: 64, ms: 150},
                    {idx: 65, ms: 150},
                    {idx: 66, ms: 350},
                    {idx: 72, ms: 10000}
                ]
            },
            108: {
                name: "Tree 9",
                oy: -20,
                ox: 16,
                idx: 62
            }
        }
    }
};

GAME_DATA.tilesets.maps['woodlands-old'] = {
    src: "woodlands-old.png",
    measurements: {
        sprite: {
            width: 32,
            height: 32
        },
        tile: {
            width: 32,
            depth: 16,
            height: 8
        }
    },
    configuration: {
        tiles: {
            // 0: {
            //     name: "Empty",
            //     idx: -1,
            //     unreachable: false,
            //     hazard: true,
            //     dirt: false,
            //     grass: false,
            //     water: false,
            //     slope: false,
            //     orientation: null,
            //     frames: [],
            //     ox: 0,
            //     oy: 0,
            //     reactions: {
            //        ice: 23,
            //        fire: 12,
            //        slashing: 55
            //     }
            // },
            00: {
                name: "Empty, Unreachable",
                idx: -1,
                unreachable: true
            },
            0: {
                name: "Empty",
                idx: -1,
                hazard: true,
            },
            1: {
                name: "Grass",
                idx: 0
            },
            2: {
                name: "Grass Slope: North",
                idx: 1,
                slope: true,
                orientation: "north"
            },
            3: {
                name: "Grass Slope: West",
                idx: 2,
                slope: true,
                orientation: "west"
            },
            4: {
                name: "Grass Slope: South",
                idx: 3,
                slope: true,
                orientation: "south"
            },
            5: {
                name: "Grass Slope: East",
                idx: 4,
                slope: true,
                orientation: "east"
            },
            11: {
                name: "Dirt",
                idx: 10
            },
            12: {
                name: "Dirt Slope: North",
                idx: 11,
                slope: true,
                orientation: "north"
            },
            13: {
                name: "Dirt Slope: West",
                idx: 12,
                slope: true,
                orientation: "west"
            },
            14: {
                name: "Dirt Slope: South",
                idx: 13,
                slope: true,
                orientation: "south"
            },
            15: {
                name: "Dirt Slope: East",
                idx: 14,
                slope: true,
                orientation: "east"
            },
            21: {
                name: "Water",
                idx: 20,
                oy: 2,
                water: true
            }
        },
        decorations: {
            0: {
                name: "Empty",
                idx: -1
            },
            1: {
                name: "Light Grass",
                idx: 21
            },
            2: {
                name: "Heavy Grass",
                idx: 22
            },
            3: {
                name: "Mushroom",
                idx: 23
            },
            4: {
                name: "Boulder",
                idx: 24
            },
            10: {
                name: "Waterfall",
                oy: 16,
                ox: 16,
                frames: [
                    { "idx": 30, "ms": 200 },
                    { "idx": 31, "ms": 200 },
                    { "idx": 32, "ms": 200 },
                    { "idx": 33, "ms": 200, "next": 10 }
                ]
            },
            11: {
                name: "Frozen Waterfall",
                idx: -1
            },
            12: {
                name: "Waterfall Extension",
                oy: 80,
                ox: 16,
                frames: [
                    { "idx": 34, "ms": 200 },
                    { "idx": 35, "ms": 200 },
                    { "idx": 36, "ms": 200 },
                    { "idx": 37, "ms": 200, "next": 12 }
                ]
            },
            13: {
                name: "Frozen Waterfall Extension",
                idx: -1
            }
        }
    }
};