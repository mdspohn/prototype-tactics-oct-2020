class EquipmentRenderer extends Renderer {
    constructor(config) {
        super(config);
    }

    // --------------------
    // RENDER
    // - renders sprite frame to canvas, accounting for delta time
    // >> undefined
    // ------------------------------
    // @ctx   <CanvasContext2d>
    // @camera   <Camera>
    // @beast    <Beast>
    // @location <Location>
    // @delta    <Integer> - milliseconds
    // ---------------------------------------
    render(ctx, camera, beast, location, delta) {
        const adjustedDelta = delta * this.getAnimationSpeed();

        ctx.save();
        ctx.translate(camera.getCanvasX() + location.getCanvasX(), camera.getCanvasY() + location.getCanvasY());
        ctx.scale(1, 1);
        ctx.drawImage(beast.tileset, 0, 0, beast.tw, beast.th, 0, 0, beast.tw, beast.th);
        ctx.restore();
    }
}