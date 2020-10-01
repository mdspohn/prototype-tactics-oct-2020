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
                oy: 27,
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
                oy: 91,
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