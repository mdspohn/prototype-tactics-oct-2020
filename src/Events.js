class EventManager {
    constructor() {
        this.events = new Object();
    }

    dispatch(identifier, data) {
        console.log(identifier);
        if (this.events[identifier] !== undefined) {
            for (let [id, listener] of Object.entries(this.events[identifier])) {
                listener.fn(data, id);
                if (!listener.persistent)
                    this.remove(identifier, id);
            }
        }
    }

    listen(identifier, callback, persistent = false) {
        this.events[identifier] = this.events[identifier] || new Object();

        if (typeof callback === 'function') {
            // generate id - should always be unique because of how Math.random() works, but fallback to reroll if not
            const id = '_' + Math.random().toString(36).substr(2, 9);
            if (this.events[identifier][id] !== undefined) {
                console.warning('Duplicate event ID created. Generating new ID.', id);
                return this.listen(identifier, callback, persistent);
            }

            this.events[identifier][id] = { fn: callback, persistent };
            return id;
        }
    }

    remove(identifier, id) {
        if (this.events[identifier]?.[id] !== undefined)
                delete this.events[identifier][id];
    }
}