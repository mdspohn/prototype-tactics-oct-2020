/* ------------------------
// Combat Controller
// ------------------------ */

class CombatController {
    constructor() {
        this.quest    = null; // quest data
        this.map      = null; // map instance
        this.focus    = null; // tile cursor
        this.entities = null; // entity instances on the map
        this.active   = null; // currently acting entity
        this.state    = null; // combat state, dictating possible events

        this.COMBAT_STATES = new Object();
        this.COMBAT_STATES['ENEMY_TURN'] = 0;
        this.COMBAT_STATES['PLAYER_TURN'] = 1;
        this.COMBAT_STATES['PLAYER_TURN_MOVE'] = 2;
        this.COMBAT_STATES['PLAYER_TURN_SKILL'] = 3;
    }

    // -----------------------
    // Engine Loop
    // -----------------------

    update(step) {
        this.map.update(step);
        this.entities.forEach(entity => entity.update(step));
    }

    render(delta) {
        this.map.getSorted().forEach(location => {
            const translate = this.map.render(delta, location);
            // if (this.focus && this.focus.x == location.x && this.focus.y == location.y)
            //     this.interface.renderFocus(delta, location, translate);
            this.map.renderDecoration(delta, location, translate);
            this.entities.forEach(entity => {
                if (location.x == entity.x && location.y == entity.y)
                    entity.render(delta, location, translate);
            });
        });
    }

    // -----------------------
    // Game State Transitioning
    // -----------------------

    async prepare(quest) {
        this.map = Data.getMap('test-map');
        this.entities = new Array();

        const entity = Data.getBeast('slime', {
            x: 1,
            y: 3,
            map: this.map,
            isPlayerControlled: true
        });
        this.entities.push(entity);

        await Promise.all([
            this.interface.initialize(),
            this.map.initialize(),
            ...this.entities.map(entity => entity._load())
        ]);
    }

    async initialize() {
        this.turn = 0;
        this.entities.sort((a, b) => b.initiative - a.initiative);
        this.forecastTurns(this.entities);

        await Game.camera.setPosition({
            x: Game.camera.getCenterCoords(this.map).x,
            y: Game.canvas.height,
            pixels: true,
            isAbsolute: true
        });
        await Game.camera.setTarget({
            y: Game.camera.getCenterCoords(this.map).y,
            ms: 1000,
            pixels: true,
            isAbsolute: true,
            easing: 'ease-out'
        });
        await this.interface.show('turn-order');
        await this.nextTurn();
    }

    // -----------------------
    // Player Actions
    // -----------------------

    async _Wait(event) {
        await this._Cancel();
        await this.endTurn();
        await this.nextTurn();
    }

    async _Move(event) {
        if (this.state ===  this.COMBAT_STATES.PLAYER_TURN) {
            this.state = this.COMBAT_STATES.PLAYER_TURN_MOVE;
            this.interface.setMarkers(this.active.getMovementRange(this.map.layout, this.entities), this.interface.MARKER_TYPES.MOVEMENT);
        } else if (this.state === this.COMBAT_STATES.PLAYER_TURN_MOVE) {
            this._Cancel();
        }
    }

    async _Skill(id) {
        if (this.state === this.COMBAT_STATES.PLAYER_TURN) {
            this.state = this.COMBAT_STATES.PLAYER_TURN_SKILL;
            this.interface.setMarkers(this.active.skills[id - 1].getRange(this.active, this.map.layout, this.entities), this.interface.MARKER_TYPES.ATTACK);
        } else if (this.state === this.COMBAT_STATES.PLAYER_TURN_SKILL) {
            this._Cancel();
        } else if (this.state === this.COMBAT_STATES.PLAYER_TURN_SKILL_CONFIRM) {
            this._Cancel();
        }
    }

    async _Confirm(event) {
        if (this.state === this.COMBAT_STATES.PLAYER_TURN) {
            // do nothing
        } else if (this.state === this.COMBAT_STATES.PLAYER_TURN_MOVE) {
            if (this.active.canMoveTo(this.focus)) {
                this.interface.setMarkers({
                    [this.focus.x]: {
                        [this.focus.y]: {
                            showMarker: true
                        }
                    }
                });
                await this.active.moveTo(this.focus);
                this._Cancel();
            }
        } else if (this.state === this.COMBAT_STATES.PLAYER_TURN_SKILL) {
            const target = this.entities.find(entity => entity.x == this.focus.x && entity.y == this.focus.y);
            if (target != undefined && target != this.active) {
                this._Cancel();
                await this.active.attack(target);
            }

        } else if (this.state === this.COMBAT_STATES.PLAYER_TURN_SKILL_CONFIRM) {
            
        }
    }

    async _Cancel(event) {
        this.interface.setMarkers(null);

        if (this.state === this.COMBAT_STATES.PLAYER_TURN) {
            // do nothing
        } else if (this.state === this.COMBAT_STATES.PLAYER_TURN_MOVE) {
            this.state = this.COMBAT_STATES.PLAYER_TURN;
        } else if (this.state === this.COMBAT_STATES.PLAYER_TURN_SKILL) {
            this.state = this.COMBAT_STATES.PLAYER_TURN;
        } else if (this.state === this.COMBAT_STATES.PLAYER_TURN_SKILL_CONFIRM) {
            this.state = this.COMBAT_STATES.PLAYER_TURN_SKILL;
        }
    }

    // -----------------------
    // Input Events
    // -----------------------

    async _handleInput(code, event) {
        switch(code) {
            case 'MouseMove':
                if (this.isProcessingMouseMove) {
                    this.isProcessingMouseMove = true;
                    setTimeout(() => this.isProcessingMouseMove = false, 1000);
                }
                break;
            case 'Click':
                const tile = Game.camera.windowToTile(event.clientX, event.clientY);
                if (tile != undefined) {
                    this.focus = tile;
                    await this._handleInput('Confirm', event);
                }
                break;
            default:
                if (this.isProcessingAction)
                    return;

                this.isProcessingAction = true;
                switch(code) {
                    case 'Confirm':
                        await this._Confirm(event);
                        break;
                    case 'Cancel':
                        await this._Cancel(event);
                        break;
                    case 'Wait':
                        await this._Wait(event);
                        break;
                    case 'Move':
                        await this._Move(event);
                        break;
                    case 'Skill':
                        await this._Skill(event);
                        break;
                }
                this.isProcessingAction = false;
        }
    }
}