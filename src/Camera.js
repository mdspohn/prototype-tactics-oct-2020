class Camera {
    constructor() {
        // browser / application window
        this.window = new Object();
        this.window.x = window.innerWidth;
        this.window.y = window.innerHeight;

        // playable canvas zoom (always integer to preserve pixel art)
        this.zoom = 1;

        // the camera's target destination
        this.target = new Object();
        this.target.x = 0;
        this.target.y = 0;

        // the camera's current position
        this.position = new Object();
        this.position.x = 0;
        this.position.y = 0;

        // camera movement calculations
        this.easing = 'linear';
        this.msRequested = 0;
        this.msRemaining = 0;
        this.partialX = 0;
        this.partialY = 0;

        // state of resolution transformations
        this.isProcessing = false;
        this.hasPendingChange = false;

        this.isProcessingCameraMovement = false;
    }

    initialize() {
        this._onWindowResize(Game.canvas);
    }

    update(step) {
        if (!this.isProcessingCameraMovement)
            return;
        
        let percentage = (step * 1000) / this.msRemaining,
            adjustedPercentage = percentage;
        
        switch(this.easing) {
            case 'ease-in':
                adjustedPercentage = percentage * (percentage * 10);
                break;
            case 'ease-out':
                adjustedPercentage = percentage * (2 - percentage);
                break;
            default: 
                adjustedPercentage = percentage;
                break;
        }

        this.partialX += adjustedPercentage * (this.target.x - this.position.x);
        this.partialY += adjustedPercentage * (this.target.y - this.position.y);

        let xChange, yChange;
        this.partialX -= xChange = (Math.sign(this.partialX) > 0) ? Math.floor(this.partialX) : Math.ceil(this.partialX);
        this.partialY -= yChange = (Math.sign(this.partialY) > 0) ? Math.floor(this.partialY) : Math.ceil(this.partialY);

        this.msRemaining = Math.max(this.msRemaining - (step * 1000), 0);

        if (this.target.x - this.position.x > 0) {
            this.position.x = Math.min(this.target.x, this.position.x + xChange);
        } else if (this.target.x - this.position.x < 0) {
            this.position.x = Math.max(this.target.x, this.position.x + xChange);
        }

        if (this.target.y - this.position.y > 0) {
            this.position.y = Math.min(this.target.y, this.position.y + yChange);
        } else if (this.target.y - this.position.y < 0) {
            this.position.y = Math.max(this.target.y, this.position.y + yChange);
        }

        if (this.position.x == this.target.x && this.position.y == this.target.y)
            Events.dispatch('camera-movement-complete');
    }

    setTarget({ x, y, ms = 1000, easing = 'linear', pixels = false, isAbsolute = false } = opts) {
        this.isProcessingCameraMovement = true;
        this.target.x = (x != undefined && isAbsolute) ? 0 : this.target.x;
        this.target.y = (y != undefined && isAbsolute) ? 0 : this.target.y;

        x = (x != undefined) ? x : 0;
        x = (pixels) ? x : Math.floor(x / 100 * Game.canvas.width);
        y = (y != undefined) ? y : 0;
        y = (pixels) ? y : Math.floor(y / 100 * Game.canvas.height);
        
        this.easing = easing;
        this.msRequested = this.msRemaining = ms;
        this.partialX = 0;
        this.partialY = 0;

        this.target.x += x;
        this.target.y += y;

        return new Promise((resolve, reject) => {
            Events.listen('camera-movement-complete', () => {
                this.isProcessingCameraMovement = false;
                resolve();
            });
        });
    }

    setPosition({ x, y, pixels = false, isAbsolute = false } = opts) {
        this.position.x = (isAbsolute && x != undefined) ? 0 : this.position.x;
        this.position.y = (isAbsolute && y != undefined) ? 0 : this.position.y;

        x = (x != undefined) ? x : 0;
        y = (y != undefined) ? y : 0;
        
        this.target.x = this.position.x += (pixels) ? x : Math.floor((x / 100) * Game.canvas.width);
        this.target.y = this.position.y += (pixels) ? y : Math.floor((y / 100) * Game.canvas.height);

        return Promise.resolve();
    }

    getCenterCoords(map) {
        const lastTile = map.structure[map.structure.length - 1];
        return {
            x: Math.floor((Game.canvas.width / 2) - 16),
            y: Math.floor((Game.canvas.height / 2) - ((lastTile.x + lastTile.y + 1) * 4))
        }
    }

    // -----------------------------
    // utility functions
    // ------------------------------------
    
    windowToCanvas(windowX, windowY) {
        // translate window (x, y) to canvas (x, y)
        const x = Math.floor(windowX / this.zoom),
              y = Math.floor(windowY / this.zoom);

        return { x, y };
    }

    windowToTile(windowX, windowY) {
        const canvasCoords = this.windowToCanvas(windowX, windowY);
        return this.canvasToTile(canvasCoords.x, canvasCoords.y);
    }

    tileToCanvas(row, col) {
        const sConfig = Game.controllers[Game.state].map.tileConfig,
              height  = Game.controllers[Game.state].map.layout[row][col].z;
        const x = this.position.x + ((col - row) * (sConfig.width / 2)),
              y = this.position.y + ((row + col) * (sConfig.depth / 2)) - (height * sConfig.height);

        return { x, y };
    }

    canvasToTile(x, y) {
        x -= this.position.x;
        y -= this.position.y;
        let match;
        Game.controllers[Game.state].map.layout.forEach((row, ri) => {
            row.forEach((tile, ci) => {
                if (x >= (tile.posX - 16) && x <= (tile.posX + 16)) {
                    if (y >= tile.posY && y <= (tile.posY + 16)) {
                        let pixelsInX = x - tile.posX + 16;
                        if (Math.ceil((16 - Math.abs(16 - pixelsInX)) / 2) >= Math.abs(8 - (y - tile.posY))) {
                            match = { x: ri, y: ci };
                        }
                    }
                }
            });
        });
        return match;
    }

    distanceToEdgeOfScreen(canvasX, canvasY) {
        const x = Math.min(Game.canvas.width - canvasX, canvasX),
              y = Math.min(Game.canvas.height - canvasY, canvasY);
        
        return { x, y };
    }

    // ----------------------------
    // methods for altering camera behavior and position
    // ---------------------------------------

    toPosition(canvasX, canvasY) {
        this.target.x -= Math.floor(canvasX - (Game.canvas.width / 2));
        this.target.y -= Math.floor(canvasY - (Game.canvas.height / 2));
    }

    toTile(row, col) {
        const sConfig = Game.controllers[Game.state].map.tileConfig,
              height  = Game.controllers[Game.state].map.layout[row][col].z;
        const x = this.position.x + ((col - row) * (sConfig.width / 2)) + (sConfig.width / 2),
              y = this.position.y + ((row + col) * (sConfig.depth / 2)) - (height * sConfig.height);
        
        return this.setTarget({
            x: -Math.floor(x - (Game.canvas.width / 2)),
            y: -Math.floor(y - (Game.canvas.height / 2)),
            ms: 700,
            easing: 'ease-out',
            pixels: true,
            isAbsolute: false
        });
    }

    toCenter() {
        this.position.x = this.target.x = Math.floor(Game.canvas.width / 2) - 16;
        this.position.y = this.target.y = Math.floor(Game.canvas.height / 2) - 16;
    }

    // ----------------------------
    // resolution change handlers
    // --------------------------------------

    _onWindowResize(canvas = Game.canvas) {
        if (this.inProcess)
            return this.hasPendingChange = true;
        
        this.inProcess = true;

        this.window.x = window.innerWidth;
        this.window.y = window.innerHeight;

        const oldCanvasWidth  = canvas.width,
              oldCanvasHeight = canvas.height,
              maxZoomX = Math.floor(this.window.x / 480),
              maxZoomY = Math.floor(this.window.y / 270);
        
        this.zoom = Math.max(maxZoomX, maxZoomY);

        // target resolution is 16:9 - 480 x 270
        const remainderX = this.window.x - (480 * this.zoom),
              remainderY = this.window.y - (270 * this.zoom);
        
        // adjust resolution
        canvas.width  = Math.ceil(480 + (remainderX / this.zoom));
        canvas.height = Math.ceil(270 + (remainderY / this.zoom));
        canvas.style.width  = canvas.width  * this.zoom + 'px';
        canvas.style.height = canvas.height * this.zoom + 'px';

        // update camera position after resolution change
        const widthChange  = (canvas.width - oldCanvasWidth) / 2,
              heightChange = (canvas.height - oldCanvasHeight) / 2;

        this.position.x = this.target.x = this.position.x + ((widthChange > 0) ? Math.ceil(widthChange) : Math.floor(widthChange));
        this.position.y = this.target.y = this.position.y + ((heightChange > 0) ? Math.ceil(heightChange) : Math.floor(heightChange));

        // process any pending resolution changes that came through
        this.inProcess = false;
        if (this.hasPendingChange)
            this._resizeCanvas(canvas);
        
        this.hasPendingChange = false;
    }
}