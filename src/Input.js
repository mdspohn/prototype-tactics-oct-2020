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
        document.addEventListener('mousemove', event => Game.onMouseMove(event));
        document.addEventListener('wheel',     event => Game.onMouseWheel(event));
        document.addEventListener('click',     event => Game.onClick(event));
        document.addEventListener('keyup',     event => Game.onKeyUp(event));
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            Game.onRightClick(event);
        });
    }

    update(step) {
        //return this.actions.splice(0, this.actions.length);
    }
}