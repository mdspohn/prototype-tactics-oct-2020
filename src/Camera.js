class Camera {
    constructor({ canvas, ctx, scaling } = settings) {
        this.window = new Object();
        this.window.x = window.innerWidth;
        this.window.y = window.innerHeight;

        this.zoom = 1;
        this.scaling = scaling;

        this.position = new Object();
        this.position.x = 0;
        this.position.y = 0;

        this.target = new Object();
        this.target.x = 0;
        this.target.y = 0;

        this.msRemaining = 0;

        this.delta = new Object();
        this.delta.x = 0;
        this.delta.y = 0;

        // to preserve pixel-perfect assets, canvas adjustments may accumulate small rounding errors
        this.adjustment = new Object();
        this.adjustment.x = 0;
        this.adjustment.y = 0;

        this.posX = () => Math.round(this.position.x + this.delta.x);
        this.posY = () => Math.round(this.position.y + this.delta.y);

        window.addEventListener('resize', () => this._resizeCanvas(canvas, ctx));
        window.addEventListener('fullscreenchange', () => this._resizeCanvas(canvas, ctx));
        
        this._resizeCanvas(canvas, ctx);
    }

    // ------------------------
    // Common Camera Movement Methods
    // ---------------------------------

    async toLocation(location, ms = 0, easing = null) {
        const x = -Math.floor((location.getPosX() * this.scaling) - (Game.canvas.width / 2) + (location.getTileWidth() * this.scaling / 2)),
              y = -Math.floor((location.getPosY() * this.scaling) - (Game.canvas.height / 2) + (location.getTileDepth() * this.scaling / 2));
        
        return this._toPosition(x, y, ms, easing);
    }

    async toCenter(canvas, map, ms = 0, easing = null) {
        const x = Math.floor((canvas.width  - (map.boundaries.x2 + map.boundaries.x1) * this.scaling) / 2) - (map.getTileWidth() * this.scaling / 2),
              y = Math.floor((canvas.height - map.boundaries.y2 * this.scaling) / 2) - (map.getTileDepth() * this.scaling / 2) - (map.getTileHeight() * this.scaling);

        return this._toPosition(x, y, ms, easing);
    }

    _toPosition(x, y, ms = 0, easing = 'ease-out') {
        this.isProcessingCameraMovement = true;

        if (ms === 0) {
            this.position.x = x;
            this.position.y = y;
        }

        this.target.x = x;
        this.target.y = y;

        this.delta.x = 0;
        this.delta.y = 0;

        this.msRemaining = ms;
        this.easing = easing;

        const cameraMovementComplete = (resolve) => {
            Events.listen('camera-movement-complete', () => {
                this.isProcessingCameraMovement = false;
                resolve();
            });
        };

        return new Promise(cameraMovementComplete);
    }

    // ------------------------
    // Camera Helper Methods / Calculations
    // ---------------------------------

    _getArea(p1, p2, p3) {
        // calculates the area of a triangle based on 3 points
        return Math.abs((p1[0] * (p2[1] - p3[1]) + p2[0] * (p3[1] - p1[1]) + p3[0] * (p1[1] - p2[1])) / 2);
    }

    _canvasToTile(x, y, map) {
        x -= this.position.x;
        y -= this.position.y;

        let match;

        map.filter(location => {
            const TILE_LEFT = location.getPosX() * this.scaling,
                  TILE_TOP  = location.getPosY() * this.scaling;

            return x >= TILE_LEFT && x < (TILE_LEFT + location.tw * this.scaling) && y >= TILE_TOP && y < (TILE_TOP + location.td * this.scaling + ((location.getZ() - 1) * location.th * this.scaling));
        }).forEach(location => {
            const TILE_X = x - location.getPosX() * this.scaling,
                  TILE_Y = y - location.getPosY() * this.scaling;
            
            
            let p1, p2, p3, p4;

            if (location.isSlope()) {
                switch(location.getOrientation()) {
                    case 'north':
                        p1 = [0,  63], p2 = [63, 0], p3 = [127,  31], p4 = [63, 95];
                        break;
                    case 'west':
                        p1 = [127, 63], p2 = [63, 0], p3 = [0,   31], p4 = [63, 95];
                        break;
                    case 'south':
                        p1 = [0,   31], p2 = [63, 31], p3 = [127, 63], p4 = [63, 63];
                        break;
                    case 'east':
                        p1 = [0,  63], p2 = [63, 31], p3 = [127,  31], p4 = [63, 63];
                        break;
                }

                const S_AREA = this._getArea(p1, p2, p3) + this._getArea(p1, p4, p3),
                      P_AREA = this._getArea([TILE_X, TILE_Y], p1, p2) +
                               this._getArea([TILE_X, TILE_Y], p1, p4) +
                               this._getArea([TILE_X, TILE_Y], p2, p3) +
                               this._getArea([TILE_X, TILE_Y], p3, p4);

                if (S_AREA == P_AREA)
                    match = location;
            } else {
                const SURFACE_HIT = Math.floor(((16 * this.scaling) - Math.abs((16 * this.scaling) - TILE_X)) / 2) >= Math.abs((8 * this.scaling) - (TILE_Y));
                if (SURFACE_HIT) {
                    match = location;
                } else {
                    const SIDE_HIT = TILE_Y > (Math.floor(((16 * this.scaling) - Math.abs((16 * this.scaling) - TILE_X)) / 2) + (8 * this.scaling));
                    if (SIDE_HIT)
                        match = undefined;
                }
            }
        });
        return match;
    }

    _windowToCanvas(x, y) {
        const coords = new Object();
        coords.x = Math.floor(x / this.zoom);
        coords.y = Math.floor(y / this.zoom);

        return coords;
    }

    _windowToTile(x, y, map) {
        const coords = this._windowToCanvas(x, y);
        return this._canvasToTile(coords.x, coords.y, map);
    }

    _resizeCanvas(canvas, ctx) {
        if (this.isProcessingResize)
            return this.isPendingResize = true;

        this.isProcessingResize = true;

        // remember old canvas dimensions for position adjustment later
        const oW = canvas.width,
              oH = canvas.height;

        // set new window dimensions
        this.window.x = window.innerWidth;
        canvas.width = Math.ceil(this.window.x / this.zoom);
        canvas.style.width = (canvas.width * this.zoom) + 'px';

        this.window.y = window.innerHeight;
        canvas.height = Math.ceil(this.window.y / this.zoom);
        canvas.style.height = (canvas.height * this.zoom) + 'px';

        // update camera position after canvas size change
        const wChange = ((canvas.width  - oW) / 2) - this.adjustment.x,
              hChange = ((canvas.height - oH) / 2) - this.adjustment.y;

        this.adjustment.x = Math.round(wChange) - wChange;
        this.adjustment.y = Math.round(hChange) - hChange;

        this.position.x = this.target.x = (this.position.x + Math.round(wChange));
        this.position.y = this.target.y = (this.position.y + Math.round(hChange));

        // process any pending changes that came through during calculation
        this.isProcessingResize = false;
        ctx.imageSmoothingEnabled = false;

        if (!this.isPendingResize)
            return false;

        this.isPendingResize = false;
        this._resizeCanvas(canvas, ctx);
    }

    _calculateCameraOffsets(ms) {
        let p = ms / this.msRemaining;

        if (this.easing != 'linear')
            p *= (this.easing == 'ease-out') ? (2 - p) : (p * 10);

        const partialX = p * (this.target.x - this.position.x),
              partialY = p * (this.target.y - this.position.y);

        let deltaX = 0,
            deltaY = 0;
                
        if (this.target.x - this.position.x > 0) {
            deltaX = Math.min(this.target.x, this.position.x + partialX) - this.position.x;
        } else if (this.target.x - this.position.x < 0) {
            deltaX = Math.max(this.target.x, this.position.x + partialX) - this.position.x;
        }

        if (this.target.y - this.position.y > 0) {
            deltaY = Math.min(this.target.y, this.position.y + partialY) - this.position.y;
        } else if (this.target.y - this.position.y < 0) {
            deltaY = Math.max(this.target.y, this.position.y + partialY) - this.position.y;
        }

        return {  x: deltaX, y: deltaY };
    }

    // ------------------------
    // Engine Hooks
    // ---------------------------------

    update(step) {
        if (this.isProcessingCameraMovement) {
            this.msRemaining = Math.max(this.msRemaining - step, 0);

            const changes = this._calculateCameraOffsets(step);
            this.position.x += changes.x;
            this.position.y += changes.y;

            if (this.position.x == this.target.x && this.position.y == this.target.y)
                Events.dispatch('camera-movement-complete');
        }
    }

    render(delta) {
        if (this.isProcessingCameraMovement) {
            const changes = this._calculateCameraOffsets(delta);
            this.delta.x = changes.x;
            this.delta.y = changes.y;
        }
    }
}