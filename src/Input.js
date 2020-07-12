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

        // action queue
        this.actions = [];

        // keyboard and mouse event listeners
        document.addEventListener('click', event => {
            this.actions.push({ key: 'Click', data: event });
        });
        document.addEventListener('mousemove', event => this.actions.push({ key: 'MouseMove', data: event }));
        document.addEventListener('keyup', event => {
            if (this.KEYBOARD[event.key])
                this.actions.push({ key: this.KEYBOARD[event.key], data: event.key });
        });
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this.actions.push({ key: 'RightClick', data: event });
        });
    }

    update(step) {
        return this.actions.splice(0, this.actions.length);
    }
}