class ViewManager {
    constructor(settings) {
        this.speed = settings.speed;
        this.scaling = settings.scaling;

        this.views = new Object();
        this.views.maps        = new MapRenderer(settings);
        this.views.decorations = new DecorationRenderer(settings);
        this.views.beasts      = new BeastRenderer(settings);
        this.views.effects     = new EffectRenderer(settings);
    }

    // ---------------------
    // Renderer Access
    // -------------------------

    getMapRenderer() {
        return this.views.maps;
    }

    getDecorationRenderer() {
        return this.views.decorations;
    }

    getBeastRenderer() {
        return this.views.beasts;
    }

    getEffectRenderer() {
        return this.views.effects;
    }

    // ----------------------
    // Animation Settings
    // ----------------------------

    getSpeed() {
        return this.speed;
    }

    getScaling() {
        return this.scaling;
    }

    setSpeed(speed = 1) {
        this.speed = speed;
        Object.values(this.views).forEach(renderer => renderer.setSpeed(this.speed));
    }

    setScaling(scaling = 1) {
        this.scaling = scaling;
        Object.values(this.views).forEach(renderer => renderer.setScaling(this.scaling));
    }

    // ----------------------
    // Animation Updates
    // ----------------------------

    updateMap(step, map) {
        this.views.maps.update(step, map);
    }

    updateDecorations(step, decorations) {
        this.views.decorations.update(step, decorations);
    }

    updateBeasts(step, beasts = []) {
        this.views.beasts.update(step, beasts);
    }

    updateEffects(step, effects) {
        this.views.effects.update(step, effects);
    }

    // ----------------------
    // Animation Rendering
    // ----------------------------

    renderLocation(delta, ctx, camera, location, map) {
        return !this.views.maps.render(delta, ctx, camera, location, map);
    }

    renderDecorations(delta, ctx, camera, location, decoration) {
        return !this.views.decorations.render(delta, ctx, camera, location, decoration);
    }

    renderBeasts(delta, ctx, camera, location, beasts = []) {
        return !beasts.filter(beast => beast.location === location).some(beast => this.views.beasts.render(delta, ctx, camera, location, beast));
    }

    renderEffects(delta, ctx, camera, location, effects = []) {
        return true;
    }
}