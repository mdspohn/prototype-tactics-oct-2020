class EventManager {
    constructor() {
        this.events = new Object();
    }

    dispatch(identifier, data) {
        console.log(identifier);
        if (this.events[identifier] != undefined) {
            for (let [id, listener] of Object.entries(this.events[identifier])) {
                listener.fn(data, id);
                if (!listener.persistent)
                    this.remove(identifier, id);
            }
        }
    }

    listen(identifier, callback, persistent = false) {
        this.events[identifier] = this.events[identifier] || new Object();

        if (typeof callback == 'function') {
            const id = Object.keys(this.events[identifier]).length;
            this.events[identifier][id] = {
                fn: callback,
                persistent
            };
        }
    }

    remove(identifier, id) {
        if (this.events[identifier] != undefined) {
            if (this.events[identifier][id] != undefined) {
                delete this.events[identifier][id];
            } else {
                delete this.events[identifier];
            }
        }
    }
}