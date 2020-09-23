class Views {
    constructor(renderers, speed, scaling) {
        this.maps        = renderers.maps;
        this.decorations = renderers.decorations;
        this.beasts      = renderers.beasts;
        this.equipment   = renderers.equipment;
        this.effects     = renderers.effects;

        this.speed = speed;
        this.scaling = scaling;
        
        this.sorting = 'X';
        Events.listen('sort', (direction) => {
            this.sorting = direction;
        }, true);
    }

    // -----------------------
    // Update
    // -------------------------

    updateMap(step, map) {
        this.maps.update(step, map, this.sorting, this.speed);
    }

    updateDecorations(step, decorations) {
        this.decorations.update(step, decorations, this.speed);
    }

    updateBeasts(step, beasts) {
        this.beasts.update(step, beasts, this.speed);
    }

    updateEffects(step, effects) {
        this.effects.update(step, effects, this.speed);
    }

    // ----------------------
    // Render
    // ----------------------------

    renderLocation(delta, ctx, camera, location, map) {
        this.maps.render(delta, ctx, camera, location, map, this.speed, this.scaling);
        return false;
    }

    renderDecorations(delta, ctx, camera, location, decoration) {
        this.decorations.render(delta, ctx, camera, location, decoration, this.speed, this.scaling);
        return false;
    }

    renderBeasts(delta, ctx, camera, location, beasts) {
        return beasts.filter(beast => beast.location === location).some(beast => this.beasts.render(delta, ctx, camera, location, beast, this.speed, this.scaling));
    }

    renderBeastToCanvas(ctx, beast, idx, isMirrored, translateX, translateY, scaling) {
        this.beasts.renderToCanvas(ctx, beast, idx, isMirrored, translateX, translateY, scaling);
        return false;
    }

    renderTileEffects(delta, ctx, camera, location, effects) {
        return false;
    }

    renderScreenEffects(delta, ctx, camera, effects) {
        return false;
    }
}