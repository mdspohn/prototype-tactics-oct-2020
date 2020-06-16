class InputManager {
    constructor() {
        this.KEYBOARD = new Object();

        // general actions
        this.KEYBOARD['ArrowUp']    = 'Up';
        this.KEYBOARD['ArrowRight'] = 'Right';
        this.KEYBOARD['ArrowDown']  = 'Down';
        this.KEYBOARD['ArrowLeft']  = 'Left';
        this.KEYBOARD['Enter']      = 'Confirm';
        this.KEYBOARD['Escape']     = 'Cancel';

        // combat actions
        this.KEYBOARD['Shift'] = 'Wait';
        this.KEYBOARD['m']     = 'Move';
        this.KEYBOARD['q']     = 'Attack';
        this.KEYBOARD['e']     = 'Special';
        this.KEYBOARD['1']     = 'Skill';
        this.KEYBOARD['2']     = 'Skill';
        this.KEYBOARD['3']     = 'Skill';
        this.KEYBOARD['4']     = 'Skill';

        // keyboard and mouse event listeners
        document.addEventListener('click', event => Game._handleInput('Click', event));
        document.addEventListener('mousemove', event => Game._handleInput('MouseMove', event));
        document.addEventListener('keyup', event => {
            if (this.KEYBOARD[event.key])
                Game._handleInput(this.KEYBOARD[event.key], event.key);
        });
    }

    update(step) {
        // controller input detection
    }
}