class Camera {
    constructor() {
        // camera configuration
        this.window   = { x: window.innerWidth, y: window.innerHeight };
        this.position = { x: 0, y: 0 };
        this.target   = { x: 0, y: 0 };
        this.zoom = 4;

        // to preserve pixel-perfect assets, canvas adjustments may accumulate small rounding errors
        this.adjustmentErrorX = 0;
        this.adjustmentErrorY = 0;

        // camera state
        // this.easing = 'linear';
        // this.msRequested = 0;
        // this.msRemaining = 0;
        // this.partialX = 0;
        // this.partialY = 0;
        // this.isProcessingCameraMovement = false;

    }

    initialize(canvas) {
        this._resizeCanvas(canvas);
    }

    _resizeCanvas(canvas) {
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
        const wChange = ((canvas.width  - oW) / 2) - this.adjustmentErrorX,
              hChange = ((canvas.height - oH) / 2) - this.adjustmentErrorY;

        this.adjustmentErrorX = Math.round(wChange) - wChange;
        this.adjustmentErrorY = Math.round(hChange) - hChange;

        this.position.x = this.target.x = (this.position.x + Math.round(wChange));
        this.position.y = this.target.y = (this.position.y + Math.round(hChange));

        // process any pending changes that came through during calculation
        this.isProcessingResize = false;

        if (!this.isPendingResize)
            return false;

        this.isPendingResize = false;
        this._resizeCanvas();
    }

    onRightClick(event) {
        const x = event.x,
              y = event.y;
        
        this.position.x = this.target.x = this.position.x + Math.round((Game.canvas.width / 2) - x / this.zoom);
        this.position.y = this.target.y = this.position.y + Math.round((Game.canvas.height / 2) - y / this.zoom);
    }

    toCenter(canvas, map) {
        this.position.x = this.target.x = Math.floor((canvas.width  - map.edges.x2 - map.edges.x1) / 2) - (map.tileset.width / 2);
        this.position.y = this.target.y = Math.floor((canvas.height - map.edges.y2) / 2) - (map.tileset.depth / 2);
    }

    toTile(canvas, map, tile) {
        this.position.x = this.target.x = Math.floor((canvas.width  - tile.posX) / 2) - (map.tileset.width / 2);
        this.position.y = this.target.y = Math.floor((canvas.height / 2) - tile.posY - (map.tileset.depth / 2));
    }

    update(step) {

    }

    // update(step) {
    //     if (!this.isProcessingCameraMovement)
    //         return;
        
    //     let percentage = (step * 1000) / this.msRemaining,
    //         adjustedPercentage = percentage;
        
    //     switch(this.easing) {
    //         case 'ease-in':
    //             adjustedPercentage = percentage * (percentage * 10);
    //             break;
    //         case 'ease-out':
    //             adjustedPercentage = percentage * (2 - percentage);
    //             break;
    //         default: 
    //             adjustedPercentage = percentage;
    //             break;
    //     }

    //     this.partialX += adjustedPercentage * (this.target.x - this.position.x);
    //     this.partialY += adjustedPercentage * (this.target.y - this.position.y);

    //     let xChange, yChange;
    //     this.partialX -= xChange = (Math.sign(this.partialX) > 0) ? Math.floor(this.partialX) : Math.ceil(this.partialX);
    //     this.partialY -= yChange = (Math.sign(this.partialY) > 0) ? Math.floor(this.partialY) : Math.ceil(this.partialY);

    //     this.msRemaining = Math.max(this.msRemaining - (step * 1000), 0);

    //     if (this.target.x - this.position.x > 0) {
    //         this.position.x = Math.min(this.target.x, this.position.x + xChange);
    //     } else if (this.target.x - this.position.x < 0) {
    //         this.position.x = Math.max(this.target.x, this.position.x + xChange);
    //     }

    //     if (this.target.y - this.position.y > 0) {
    //         this.position.y = Math.min(this.target.y, this.position.y + yChange);
    //     } else if (this.target.y - this.position.y < 0) {
    //         this.position.y = Math.max(this.target.y, this.position.y + yChange);
    //     }

    //     if (this.position.x == this.target.x && this.position.y == this.target.y)
    //         Events.dispatch('camera-movement-complete');
    // }

    // setTarget({ x, y, ms = 1000, easing = 'linear', pixels = false, isAbsolute = false } = opts) {
    //     this.isProcessingCameraMovement = true;
    //     this.target.x = (x != undefined && isAbsolute) ? 0 : this.target.x;
    //     this.target.y = (y != undefined && isAbsolute) ? 0 : this.target.y;

    //     x = (x != undefined) ? x : 0;
    //     x = (pixels) ? x : Math.floor(x / 100 * Game.canvas.width);
    //     y = (y != undefined) ? y : 0;
    //     y = (pixels) ? y : Math.floor(y / 100 * Game.canvas.height);
        
    //     this.easing = easing;
    //     this.msRequested = this.msRemaining = ms;
    //     this.partialX = 0;
    //     this.partialY = 0;

    //     this.target.x += x;
    //     this.target.y += y;

    //     return new Promise((resolve, reject) => {
    //         Events.listen('camera-movement-complete', () => {
    //             this.isProcessingCameraMovement = false;
    //             resolve();
    //         });
    //     });
    // }

    // setPosition({ x, y, pixels = false, isAbsolute = false } = opts) {
    //     this.position.x = (isAbsolute && x != undefined) ? 0 : this.position.x;
    //     this.position.y = (isAbsolute && y != undefined) ? 0 : this.position.y;

    //     x = (x != undefined) ? x : 0;
    //     y = (y != undefined) ? y : 0;
        
    //     this.target.x = this.position.x += (pixels) ? x : Math.floor((x / 100) * Game.canvas.width);
    //     this.target.y = this.position.y += (pixels) ? y : Math.floor((y / 100) * Game.canvas.height);

    //     return Promise.resolve();
    // }

    // // -----------------------------
    // // utility functions
    // // ------------------------------------

    // getCenterCoords(map) {
    //     const lastTile = map.structure[map.structure.length - 1];
    //     return {
    //         x: Math.floor((Game.canvas.width / 2)),
    //         y: Math.floor((Game.canvas.height / 2) - ((lastTile.x + lastTile.y) * this.zoom + 8 /* half of tile depth */))
    //     }
    // }
    
    // windowToCanvas(windowX, windowY) {
    //     // translate window (x, y) to canvas (x, y)
    //     const x = Math.floor(windowX / this.zoom),
    //           y = Math.floor(windowY / this.zoom);

    //     return { x, y };
    // }

    // windowToTile(windowX, windowY) {
    //     const canvasCoords = this.windowToCanvas(windowX, windowY);
    //     return this.canvasToTile(canvasCoords.x, canvasCoords.y);
    // }

    // tileToCanvas(row, col) {
    //     const sConfig = Game.controllers[Game.state].map.tileConfig,
    //           height  = Game.controllers[Game.state].map.layout[row][col].z;
    //     const x = this.position.x + ((col - row) * (sConfig.width / 2)),
    //           y = this.position.y + ((row + col) * (sConfig.depth / 2)) - (height * sConfig.height);

    //     return { x, y };
    // }

    // canvasToTile(x, y) {
    //     x -= this.position.x;
    //     y -= this.position.y;
    //     let match;
    //     Game.controllers[Game.state].map.layout.forEach((row, ri) => {
    //         row.forEach((tile, ci) => {
    //             if (x >= (tile.posX - 16) && x <= (tile.posX + 16)) {
    //                 if (y >= tile.posY && y <= (tile.posY + 16)) {
    //                     let pixelsInX = x - tile.posX + 16;
    //                     if (Math.ceil((16 - Math.abs(16 - pixelsInX)) / 2) >= Math.abs(8 - (y - tile.posY))) {
    //                         match = { x: ri, y: ci };
    //                     }
    //                 }
    //             }
    //         });
    //     });
    //     return match;
    // }

    // distanceToEdgeOfScreen(canvasX, canvasY) {
    //     const x = Math.min(Game.canvas.width - canvasX, canvasX),
    //           y = Math.min(Game.canvas.height - canvasY, canvasY);
        
    //     return { x, y };
    // }

    // // ----------------------------
    // // methods for altering camera behavior and position
    // // ---------------------------------------

    // toPosition(canvasX, canvasY) {
    //     this.target.x -= Math.floor(canvasX - (Game.canvas.width / 2));
    //     this.target.y -= Math.floor(canvasY - (Game.canvas.height / 2));
    // }

    // // toTile(row, col) {
    // //     const sConfig = Game.controllers[Game.state].map.tileConfig,
    // //           height  = Game.controllers[Game.state].map.layout[row][col].z;
    // //     const x = this.position.x + ((col - row) * (sConfig.width / 2)) + (sConfig.width / 2),
    // //           y = this.position.y + ((row + col) * (sConfig.depth / 2)) - (height * sConfig.height);
        
    // //     return this.setTarget({
    // //         x: -Math.floor(x - (Game.canvas.width / 2)),
    // //         y: -Math.floor(y - (Game.canvas.height / 2)),
    // //         ms: 700,
    // //         easing: 'ease-out',
    // //         pixels: true,
    // //         isAbsolute: false
    // //     });
    // // }
}