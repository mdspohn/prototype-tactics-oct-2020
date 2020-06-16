class Interface {
    constructor(...config) {
        this.state = null;
        this.dom = new Object();
        this.elements = new Object();
        this.processing = new Array();
    }

    update(step) {
        this.processing.forEach(group => group.forEach(element => this._updateElement(element, step)));
    }

    _updateElement(element, step) {
        if (element.msRemaining == 0)
            return;
        
        const remaining = element.target - element.current,
              percentage = Math.min(1, (step * 1000) / element.msRemaining);
    
        let change = percentage;
        if (change !== 1) {
            switch(element.easing) {
                case 'ease-in':
                    change = percentage * (percentage * 10);
                    break;
                case 'ease-out':
                    change = percentage * (2 - percentage);
                    break;
                default: 
                    change = percentage;
            }
        }
    
        element.current += (remaining * Math.min(1, change));
        element.msCalculated += (step * 1000);
    }

    render(delta) {
        let complete = false;
        this.processing.forEach(group => group.forEach(element => complete = this._renderElement(element, delta)));
    
        if (complete) {
            this.processing = new Array();
            Events.dispatch('menu-animation-complete');
        }
    }
    
    _renderElement(element, delta) {
        if (element.msCalculated == 0)
            return;
        
        let value = element.current;
        if (element.measurement != undefined)
            value += element.measurement;
        
        element.elem.style[element.style] = value;
        element.msRemaining -= Math.min(element.msCalculated, element.msRemaining);
        element.msCalculated = 0;
    
        return element.msRemaining === 0;
    };

    show(name) {
        if (this.elements[name] != undefined) {
            this.elements[name].forEach(element => this._prepareElement(element, 'show'));
            this.processing.push(this.elements[name]);
            return new Promise((resolve, reject) => Events.listen('menu-animation-complete', () => resolve()));
        }
        return Promise.resolve();
    }

    hide(name) {
        if (this.elements[name] != undefined) {
            this.elements[name].forEach((element) => this._prepareElement(element, 'hide'));
            this.processing.push(this.elements[name]);
            return new Promise((resolve, reject) => {
                Events.listen('menu-animation-complete', () => {
                    this.elements[name].forEach(element => element.elem.classList.toggle('show', false));
                    resolve();
                });
            });
        }
        return Promise.resolve();
    }

    hideAll() {
        Object.values(this.elements).forEach(group => {
            group.forEach((element) => this._prepareElement(element, 'hide'));
            this.processing.push(group);
        });
        
        return new Promise((resolve, reject) => {
            Events.listen('menu-animation-complete', () => {
                Object.values(this.elements).forEach(group => group.forEach(element => element.elem.classList.toggle('show', false)));
                resolve();
            });
        });
    }

    _prepareElement(element, method = 'show') {
        element.msCalculated = 0;

        if (!element[method])
            return element.msRemaining = 0;

        element.easing      = element[method].easing || element.easing;
        element.target      = element[method].end;
        element.current     = element[method].start;
        element.msRemaining = element[method].ms;

        let value = element.current;
        if (element.measurement != undefined)
            value += element.measurement;
        
        element.elem.style[element.style] = value;
        element.elem.classList.toggle('show', true);
    }
}