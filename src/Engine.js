class GameEngine {
    constructor() {
        this.step = 1 / 60;
        this.frame = 0;
    }

    start() {
        let last,
            now = performance.now(),
            delta = this.step;

        const loop = (timestamp) => {
            this.frame = requestAnimationFrame(loop);
    
            last = now;
            now = timestamp;
            delta = delta + Math.min(1, (now - last) / 1000);
    
            while(delta > this.step) {
                delta -= this.step;
                this.update(this.step);
            }
    
            this.render(delta);
        }
        this.frame = requestAnimationFrame(loop);
        console.log('Engine started...');
    }

    stop() {
        cancelAnimationFrame(this.frame);
        console.log('Engine stopped...');
    }

    update(step) {
        Game.update(step);
    }

    render(delta) {
        Game.render(delta);
    }
}