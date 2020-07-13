class GameEngine {
    constructor() {
        this.step = 1000 / 20; // update 20 times a second
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
            delta = delta + (now - last); // catch up
    
            while(delta >= this.step) {
                delta -= this.step;
                Game.update(this.step);
            }
    
            Game.render(delta);
        }
        this.frame = requestAnimationFrame(loop);
        console.log('Engine started...');
    }

    stop() {
        cancelAnimationFrame(this.frame);
        console.log('Engine stopped...');
    }
}