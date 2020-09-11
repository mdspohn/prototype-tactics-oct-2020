class AnimationManager {
    constructor(settings) {
        this.speed = settings.speed;
        this.scaling = settings.scaling;

        this.renderers = new Object();
        this.renderers.maps        = new MapRenderer(settings);
        this.renderers.decorations = new DecorationRenderer(settings);
        this.renderers.markers     = new MarkerRenderer(settings);
        this.renderers.beasts      = new BeastRenderer(settings);
        this.renderers.equipment   = new EquipmentRenderer(settings);
        this.renderers.skills      = new SkillRenderer(settings);
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
        Object.values(this.renderers).forEach(renderer => renderer.setSpeed(this.speed));
    }

    setScaling(scaling = 1) {
        this.scaling = scaling;
        Object.values(this.renderers).forEach(renderer => renderer.setScaling(this.scaling));
    }

    // ----------------------
    // Animation Updates
    // ----------------------------

    updateMap(step, map) {
        this.renderers.maps.update(step, map);
    }

    updateDecorations(step, decoration) {
        //this.renderers.decorations.update(step, decoration);
    }

    updateMarkers(step, markers) {
        this.renderers.markers.update(step, markers);
    }

    updateBeasts(step, beasts = []) {
        beasts.forEach(beast => this.renderers.beasts.update(step, beast));
    }

    updateSkills(step, skills = []) {
        skills.forEach(skill => this.renderers.skills.update(step, skill));
    }

    updateInterface(step, ui) {
        ui.update(step);
    }

    // ----------------------
    // Animation Rendering
    // ----------------------------

    renderMap(delta, ctx, camera, location, map) {
        this.renderers.maps.render(delta, ctx, camera, location, map);
    }

    renderDecorations(delta, ctx, camera, location, decoration) {
        //this.renderers.decorations.render(delta, ctx, camera, location, decoration);
    }

    renderMarkers(delta, ctx, camera, location, markers) {
        this.renderers.markers.render(delta, ctx, camera, location, markers);
    }

    renderBeasts(delta, ctx, camera, location, beasts = []) {
        beasts.filter(beast => beast.location === location).forEach(beast => this.renderers.beasts.render(delta, ctx, camera, location, beast));
    }

    renderSkills(delta, ctx, camera, location, skills = []) {

    }

    renderInterface(delta, ui) {
        ui.render(delta);
    }
}