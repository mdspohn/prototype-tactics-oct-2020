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

    updateMap(map, ms) {
        MapRenderer.update(map, ms, this.settings);
    }

    updateBeasts(beasts, ms) {
        BeastRenderer.update(beasts, ms, this.settings);
    }

    updateEffects(effects, ms) {
        EffectRenderer.update(effects, ms, this.settings);
    }

    updateMarkers(markers, ms) {
        MarkerRenderer.update(markers, ms, this.settings);
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