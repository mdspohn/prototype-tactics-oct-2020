class GameEngine {
    constructor() {
        this.step = 1000 / 20;
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
            delta = delta + (now - last);
    
            while (delta >= this.step) {
                delta -= this.step;
                Game.update(this.step);
            }
    
            Game.render(now - last);
        }
        this.frame = requestAnimationFrame(loop);
        console.log('Engine started...');
    }

    stop() {
        cancelAnimationFrame(this.frame);
        console.log('Engine stopped...');
    }
}