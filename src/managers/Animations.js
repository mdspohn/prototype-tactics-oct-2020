class AnimationManager {
    constructor(config = { speed: 1, scaling: 1 }) {
        this.speed = config.speed;
        this.scaling = config.scaling;

        this.renderers = new Object();
        this.renderers.maps        = new MapRenderer(config);
        this.renderers.decorations = new DecorationRenderer(config);
        this.renderers.markers     = new MarkerRenderer(config);
        this.rendeders.beasts      = new BeastRenderer(config);
        this.renderers.equipment   = new EquipmentRenderer(config);
        this.renderers.skills      = new SkillRenderer(config);
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
        this.renderers.map.update(step, map);
    }

    updateDecorations(step, decorations) {
        this.renderers.decorations.update(step, decorations);
    }

    updateMarkers(step, markers) {
        this.renderers.markers.update(step, markers);
    }

    updateBeasts(step, beasts) {
        beasts.forEach(beast => this.renderers.beasts.update(step, beast));
    }

    updateSkills(step, skills) {
        skills.forEach(skill => this.renderers.skills.update(step, skill));
    }

    // ----------------------
    // Animation Rendering
    // ----------------------------

    renderMap(delta, ctx, camera, location, map) {

    }

    renderDecorations(delta, ctx, camera, location, decorations) {

    }

    renderMarkers(delta, ctx, camera, location, markers) {

    }

    renderBeasts(delta, ctx, camera, location, beasts) {

    }

    renderSkills(delta, ctx, camera, location, skills) {

    }
}