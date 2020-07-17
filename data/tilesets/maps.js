if (GAME_DATA.tilesets == undefined)
    GAME_DATA.tilesets = new Object();

GAME_DATA.tilesets.maps = new Object();
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
        "0": { "name": "Empty",            "idx": -1,  "unreachable": true },
        "1": { "name": "Grass",            "idx": 0 },
        "2": { "name": "Dirt Slope North", "idx": 1,   "slope": true, "orientation": "n" },
        "9": { "name": "Dirt Slope West",  "idx": 7,   "slope": true, "orientation": "w" },
        "4": { "name": "Dirt",             "idx": 3 },
        "5": { "name": "Ice",              "idx": 4 },
        "6": { "name": "Stump",            "idx": 5 },
        "7": { "name": "Dirt Slope South", "idx": 6,   "slope": true, "orientation": "s" },
        "8": { "name": "Dirt Slope East",  "idx": 8,   "slope": true, "orientation": "e" },
        "3": { "name": "Water",            "idx": 2,   "water": true },
        "10": {
            "name": "Meteor Landing",
            "frames": [
                { "idx": 3, "ms": 200, "oy": 4 },
                { "idx": 3, "ms": 100, "oy": 3 },
                { "idx": 3, "ms": 75, "oy": 2 },
                { "idx": 3, "ms": 50, "oy": 1, "next": 4 },
            ]
        },
        "11": {
            "name": "Meteor Debris North",
            "frames": [
                { "idx": 1, "ms": 200, "oy": 4 },
                { "idx": 1, "ms": 200, "oy": 5 },
                { "idx": 1, "ms": 200, "oy": 6 },
                { "idx": 1, "ms": 100, "oy": 7, "next": 0 }
            ]
        },
        "12": {
            "name": "Meteor Debris West",
            "frames": [
                { "idx": 7, "ms": 200, "oy": 4 },
                { "idx": 7, "ms": 200, "oy": 5 },
                { "idx": 7, "ms": 200, "oy": 6 },
                { "idx": 7, "ms": 100, "oy": 7, "next": 0 }
            ]
        },
        "13": {
            "name": "Meteor Debris South",
            "frames": [
                { "idx": 6, "ms": 200, "oy": 4 },
                { "idx": 6, "ms": 200, "oy": 5 },
                { "idx": 6, "ms": 200, "oy": 6 },
                { "idx": 6, "ms": 100, "oy": 7, "next": 0 }
            ]
        },
        "14": {
            "name": "Meteor Debris East",
            "frames": [
                { "idx": 8, "ms": 200, "oy": 4 },
                { "idx": 8, "ms": 200, "oy": 5 },
                { "idx": 8, "ms": 200, "oy": 6 },
                { "idx": 8, "ms": 100, "oy": 7, "next": 0 }
            ]
        },
        "15": {
            "name": "Meteor Debris All",
            "frames": [
                { "idx": 3, "ms": 200, "oy": -2 },
                { "idx": 3, "ms": 100, "oy": -1, "next": 4 }
            ]
        },
        "16": {
            "name": "Meteor Landing",
            "frames": [
                { "idx": 2, "ms": 150, "oy": 4 },
                { "idx": 2, "ms": 100, "oy": 3 },
                { "idx": 2, "ms": 75, "oy": 2 },
                { "idx": 2, "ms": 50, "oy": 1, "next": 3 },
            ]
        },
        "17": {
            "name": "Meteor Launch",
            "frames": [
                { "idx": 3, "ms": 150, "oy": 2 },
                { "idx": 3, "ms": 100, "oy": 1, "next": 4 },
            ]
        }
    }
};