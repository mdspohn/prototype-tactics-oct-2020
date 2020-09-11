class BeastRenderer extends Renderer {
    constructor(config) {
        super(config);
    }

    // --------------------
    // UPDATE
    // - updates current animation for unit
    // >> undefined
    // ------------------------------
    // @beast <Beast>
    // @step  <Integer> - milliseconds
    // ----------------------------------------
    update(step, beast) {
        beast.update(step);
        // const adjustedStep = step * this.getAnimationSpeed();
        
        // let frame = this._getAnimationFrame(beast.animation[0]);
        // beast.animation[0].ms += adjustedStep;

        // while (beast.animation[0].ms > frame.ms) {
        //     frame = this._handleFrameComplete(beast);
        // }
    } 

    // --------------------
    // RENDER
    // - renders sprite frame to canvas, accounting for delta time
    // >> undefined
    // ------------------------------
    // @ctx      <Context2d>
    // @camera   <Camera>
    // @beast    <Beast>
    // @location <Location>
    // @delta    <Integer> - milliseconds
    // ---------------------------------------
    render(delta, ctx, camera, location, beast) {
        beast.render(delta)
        // const adjustedDelta = delta * this.getAnimationSpeed();

        // ctx.save();
        // ctx.translate(camera.getCanvasX() + location.getCanvasX(), camera.getCanvasY() + location.getCanvasY());
        // ctx.scale(1, 1);
        // ctx.drawImage(beast.tileset, 0, 0, beast.tw, beast.th, 0, 0, beast.tw, beast.th);
        // ctx.restore();
    }
}