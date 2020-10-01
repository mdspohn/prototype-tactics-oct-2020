class Views {
    constructor(speed, scaling) {
        this.settings = new Object();
        this.settings.speed = speed;
        this.settings.scaling = scaling;
        this.settings.sorting = 'X';
        
        Events.listen('sort', (direction) => {
            this.settings.sorting = direction;
        }, true);
    }

    updateMap(map, ms, isDeltaUpdate = false) {
        MapRenderer.update(map, ms, isDeltaUpdate, this.settings);
    }

    updateBeasts(beasts, ms, isDeltaUpdate = false) {
        BeastRenderer.update(beasts, ms, isDeltaUpdate, this.settings);
    }

    updateEffects(effects, ms, isDeltaUpdate = false) {
        EffectRenderer.update(effects, ms, isDeltaUpdate, this.settings);
    }

    updateMarkers(markers, ms, isDeltaUpdate = false) {
        MarkerRenderer.update(markers, ms, isDeltaUpdate, this.settings);
    }

    // ----------------------
    // Render
    // ----------------------------

    renderTiles(map, location) {
        MapRenderer.renderTiles(map, location, this.settings);
    }

    renderMarkers(markers, location) {
        MarkerRenderer.render(markers, location, this.settings);
    }

    renderDecorations(map, location) {
        MapRenderer.renderDecorations(map, location, this.settings);
    }

    renderBackgroundEffects(effects, location) {
        EffectRenderer.render(effects, location, this.settings);
    }

    renderBeasts(beasts, location) {
        beasts.filter(beast => beast.location === location).forEach(beast => BeastRenderer.render(beast, location, this.settings));
    }

    renderForegroundEffects(effects, location) {
        EffectRenderer.render(effects, location, this.settings);
    }

    renderIndicators(markers, beast) {
        MarkerRenderer.renderGlobal(markers, beast, this.settings);
    }

    renderScreenEffects(effects) {
        EffectRenderer.renderGlobal(effects, location, this.settings);
    }
}