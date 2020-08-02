class DevTools {
    constructor() {
        this.FPS_COUNTER = document.getElementById('chsfps__count');

        // enable fps in UI
        document.getElementById('chs__fps').style.display = 'block';

        this.frames = 0;
        this.elapsed = 0;
    }
    
    update(step) {

        // --------------
        // FPS Counter
        // ---------------------

        this.elapsed += step;
        if (this.elapsed > 1000) {
            this.FPS_COUNTER.innerText = this.frames;
            this.frames = 0;
            this.elapsed -= 1000;
        }
    }

    render(delta) {

        // --------------
        // FPS Counter
        // ---------------------

        this.frames += 1;
    }
}