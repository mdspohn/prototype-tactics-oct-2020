class Markers {
    static EMPTY_ARRAY = new Array();
    static EMPTY_WEAKMAP = new WeakMap();

    constructor() {
        this.delta = 0;

        this.tiles = new Object();
        this.tiles.range = null;
        this.tiles.selection = null;
        this.tiles.path = null;
        this.tiles.focus = null;
        this.tiles.pointer = null;

        this.global = new Object();
        this.global.orientation = null;

        this.configurations = new Object();

        this.configurations.white = new Object();
        this.configurations.white.ms = 0;
        this.configurations.white.duration = 4000;
        this.configurations.white.opacity = 0.2;
        this.configurations.white.y = 0;

        this.configurations.yellow = new Object();
        this.configurations.yellow.ms = 0;
        this.configurations.yellow.duration = 4000;
        this.configurations.yellow.opacity = 1;
        this.configurations.yellow.y = 1;

        this.configurations.red = new Object();
        this.configurations.red.ms = 0;
        this.configurations.red.duration = 4000;
        this.configurations.red.opacity = 1;
        this.configurations.red.y = 2;

        this.configurations.focus = new Object();
        this.configurations.focus.ms = 0;
        this.configurations.focus.duration = 750;
        this.configurations.focus.y = 3;

        this.configurations.orientation = new Object();
        this.configurations.orientation[CombatLogic.NORTH] = [0, 0];
        this.configurations.orientation[CombatLogic.SOUTH] = [1, 1];
        this.configurations.orientation[CombatLogic.EAST]  = [0, 1];
        this.configurations.orientation[CombatLogic.WEST]  = [1, 0];
    }

    get range()       { return this.tiles.range     || Markers.EMPTY_WEAKMAP; }
    get selection()   { return this.tiles.selection || Markers.EMPTY_WEAKMAP; }
    get path()        { return this.tiles.path      || Markers.EMPTY_ARRAY;   }
    get focus()       { return this.tiles.focus;                              }
    get pointer()     { return this.tiles.pointer;                            }
    get orientation() { return this.global.orientation;                       }

    set range(range)             { this.tiles.range        = range;       }
    set selection(selection)     { this.tiles.selection    = selection;   }
    set path(path)               { this.tiles.path         = path;        }
    set focus(location)          { this.tiles.focus        = location;    }
    set pointer(location)        { this.tiles.pointer      = location;    }
    set orientation(orientation) { this.global.orientation = orientation; }

    load() {
        const pending = (resolve) => {
            this.img = new Image();
            this.img.onload = resolve;
            this.img.src = `${ASSET_DIR}${OS_FILE_SEPARATOR}miscellaneous${OS_FILE_SEPARATOR}tile-markers.png`;
        };
        return new Promise(pending);
    }

    clear() {
        this.range = null;
        this.selection = null;
        this.path = null;
        this.focus = null;
        this.pointer = null;
        this.orientation = null;
    }

    hasActive() {
        return this.tiles.range !== null || this.tiles.selection !== null || this.tiles.focus !== null;
    }

    forEachConfig(fn) {
        Object.values(this.configurations).forEach(fn);
    }
}