class CombatController {
    constructor() {
        // current scene objects
        this.map = null;
        this.decoration = null;
        this.entities = null;
        this.layout = null;

        // combat helpers
        this.markers = null;
        this.cutscene = null;
    }

    async _prepare() {
        // combat helpers for visually representing available actions to player
        if (this.markers == null) {
            // tile markers for movement or attack targets
            this.markers = new TileMarkers();
            await this.markers._prepare();
        }
    }

    async _initialize(scene) {
        this.map = scene.map;
        this.decoration = scene.decoration;
        this.entities = scene.entities;
        this.layout = new Layout(this.map, this.entities);
        this.entities.forEach(entity => entity.location = this.layout.getLocation(entity.x(), entity.y()));
        
        // this.entities[0].moveTo(this.layout.getLocation(6,0));
        // this.entities[0].moveTo(this.layout.getLocation(6,1));
        // this.entities[0].moveTo(this.layout.getLocation(6,2));
        // this.entities[0].moveTo(this.layout.getLocation(6,3));
        // this.entities[0].moveTo(this.layout.getLocation(6,4));
        // this.entities[0].moveTo(this.layout.getLocation(6,5));
        // this.entities[0].moveTo(this.layout.getLocation(6,6));
        // this.entities[0].moveTo(this.layout.getLocation(6,5));
        // this.entities[0].moveTo(this.layout.getLocation(6,4));
        // this.entities[0].moveTo(this.layout.getLocation(6,3));
        // this.entities[0].moveTo(this.layout.getLocation(6,2));
        // this.entities[0].moveTo(this.layout.getLocation(6,1));

        // this.entities[0].moveTo(this.layout.getLocation(6,0));
        // this.entities[0].moveTo(this.layout.getLocation(5,0));
        // this.entities[0].moveTo(this.layout.getLocation(4,0));
        // this.entities[0].moveTo(this.layout.getLocation(3,0));
        // this.entities[0].moveTo(this.layout.getLocation(3,1));
        // this.entities[0].moveTo(this.layout.getLocation(3,2));
        // this.entities[0].moveTo(this.layout.getLocation(3,3));
        // this.entities[0].moveTo(this.layout.getLocation(4,3));
        // this.entities[0].moveTo(this.layout.getLocation(5,3));
        Events.listen('launch', (entity) => {
            const loc = entity.location;
            this.map.replaceTop(loc.x,     loc.y,    17);
        }, true);
        Events.listen('crash', (entity) => {
            const loc = entity.animation.destination;
            this.map.replace(loc.x,     loc.y,    10);
            this.map.replace(loc.x - 1, loc.y,    15);
            this.map.replace(loc.x,     loc.y - 1,15);
            this.map.replace(loc.x + 1, loc.y,    15);
            this.map.replace(loc.x,     loc.y + 1,15);
            if (Math.abs(this.entities[1].x() + this.entities[1].y() - loc.x - loc.y) <= 1)
                this.entities[1].animation = this.entities[1]._getAnimationData('impact');
        }, true);
        Events.listen('crash2', (entity) => {
            const loc = entity.animation.destination;
            this.map.replace(loc.x,     loc.y,    16);
            this.map.replace(loc.x - 1, loc.y,    15);
            this.map.replace(loc.x,     loc.y - 1,15);
            this.map.replace(loc.x + 1, loc.y,    15);
            this.map.replace(loc.x,     loc.y + 1,15);
            this.entities[1].animation = this.entities[1]._getAnimationData('impact');
            this.entities[1].animationQueue.push(this.entities[1]._getAnimationData('intro'));
        }, true);
        this.entities[0].moveTo(this.layout.getLocation(4,3), 'meteor');
        this.entities[0].moveTo(this.layout.getLocation(3,1), 'meteor');
        this.entities[0].moveTo(this.layout.getLocation(5,2), 'meteor');
        this.entities[0].moveTo(this.layout.getLocation(3,2), 'meteor2');


        // this.entities[0].moveTo(this.layout.getLocation(3,5));
        // this.entities[0].moveTo(this.layout.getLocation(3,6));
        // this.entities[0].moveTo(this.layout.getLocation(4,6));
        // this.entities[0].moveTo(this.layout.getLocation(5,6));
        // this.entities[0].moveTo(this.layout.getLocation(6,6));
        // this.entities[0].moveTo(this.layout.getLocation(7,6));
        // this.entities[0].moveTo(this.layout.getLocation(7,5));
        // this.entities[0].moveTo(this.layout.getLocation(7,4));
        // this.entities[0].moveTo(this.layout.getLocation(7,3));
        // this.entities[0].moveTo(this.layout.getLocation(7,2));
        // this.entities[0].moveTo(this.layout.getLocation(7,1));
        // this.entities[0].moveTo(this.layout.getLocation(7,0));
        // this.entities[0].moveTo(this.layout.getLocation(7,1));
        // this.entities[0].moveTo(this.layout.getLocation(7,2));
        // this.entities[0].moveTo(this.layout.getLocation(7,3));
        // this.entities[0].moveTo(this.layout.getLocation(7,4));
        // this.entities[0].moveTo(this.layout.getLocation(7,5));
        // this.entities[0].moveTo(this.layout.getLocation(7,6));
        // this.entities[0].moveTo(this.layout.getLocation(6,6));
        // this.entities[0].moveTo(this.layout.getLocation(5,6));
        // this.entities[0].moveTo(this.layout.getLocation(4,6));
        // this.entities[0].moveTo(this.layout.getLocation(3,6));
        // this.entities[0].moveTo(this.layout.getLocation(3,5));
        // this.entities[0].moveTo(this.layout.getLocation(3,4));
        // this.entities[0].moveTo(this.layout.getLocation(3,3));
        // this.entities[0].moveTo(this.layout.getLocation(3,2));
        // this.entities[0].moveTo(this.layout.getLocation(3,1));
        // this.entities[0].moveTo(this.layout.getLocation(3,0));
        // this.entities[0].moveTo(this.layout.getLocation(4,0));
        // this.entities[0].moveTo(this.layout.getLocation(5,0));
        // this.entities[0].moveTo(this.layout.getLocation(6,0));
        // this.entities[0].moveTo(this.layout.getLocation(6,1));
        // this.entities[0].moveTo(this.layout.getLocation(6,2));
        // this.entities[0].moveTo(this.layout.getLocation(7,2));
        // this.entities[0].moveTo(this.layout.getLocation(8,2));
        // this.entities[0].moveTo(this.layout.getLocation(7,2));
        // this.entities[0].moveTo(this.layout.getLocation(6,2));
        // this.entities[0].moveTo(this.layout.getLocation(6,3));
        // this.entities[0].moveTo(this.layout.getLocation(6,4));
        // this.entities[0].moveTo(this.layout.getLocation(7,4));
        // this.entities[0].moveTo(this.layout.getLocation(8,4));
        // this.entities[0].moveTo(this.layout.getLocation(7,4));
        // this.entities[0].moveTo(this.layout.getLocation(6,4));
        // this.entities[0].moveTo(this.layout.getLocation(6,5));
        // this.entities[0].moveTo(this.layout.getLocation(6,6));
        // this.entities[0].moveTo(this.layout.getLocation(6,5));
    }

    onClick(event) {
        //this.map.replace(1,4, 15);
    }

    onRightClick(event) {
        //this.map.add(3,3, 10);
    }

    onKeyUp(event) {
        //this.map.replace(1,1, 4,4,4,5);
        //this.decoration.remove(1,2);
    }
    
    update(step) {
        this.layout.forEach(location => {
            this.map.update(step, location);
            this.decoration.update(step, location);
        });
        this.entities.forEach(entity => entity.update(step));
    }

    render(delta) {
        this.layout.forEach(location => {
            this.map.render(delta, location);
            this.markers.render(delta, location);
            this.decoration.render(delta, location);
            location.getOccupants().forEach(occupant => occupant.render(delta, location));
        });
    }
}