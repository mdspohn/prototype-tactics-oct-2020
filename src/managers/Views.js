class ViewManager {
    constructor(settings) {
        this.speed = settings.speed;
        this.scaling = settings.scaling;

        this.views = new Object();
        this.views.maps        = new MapRenderer(settings);
        this.views.decorations = new DecorationRenderer(settings);
        this.views.markers     = new MarkerRenderer(settings);
        this.views.beasts      = new BeastRenderer(settings);
        this.views.equipment   = new EquipmentRenderer(settings);
        this.views.skills      = new SkillRenderer(settings);
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
    
    getMarkerRenderer() {
        return this.views.markers;
    }

    getBeastRenderer() {
        return this.views.beasts;
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

    updateMarkers(step, markers) {
        this.views.markers.update(step, markers);
    }

    updateBeasts(step, beasts = []) {
        this.views.beasts.update(step, beasts);
    }

    updateSkills(step, skills = []) {
        this.views.skills.update(step, skills);
    }

    updateInterface(step, ui) {
        ui.update(step);
    }

    // ----------------------
    // Animation Rendering
    // ----------------------------

    renderMap(delta, ctx, camera, location, map) {
        this.views.maps.render(delta, ctx, camera, location, map);
    }

    renderDecorations(delta, ctx, camera, location, decoration) {
        this.views.decorations.render(delta, ctx, camera, location, decoration);
    }

    renderMarkers(delta, ctx, camera, location, markers) {
        this.views.markers.render(delta, ctx, camera, location, markers);
    }

    renderBeasts(delta, ctx, camera, location, beasts = []) {
        beasts.filter(beast => beast.location === location).forEach(beast => this.views.beasts.render(delta, ctx, camera, location, beast));
    }

    renderSkills(delta, ctx, camera, location, skills = []) {

    }

    renderInterface(delta, ui) {
        ui.render(delta);
    }
}