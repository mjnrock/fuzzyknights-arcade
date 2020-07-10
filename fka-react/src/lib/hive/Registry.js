import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { type } from "os";

export const EnumEventType = {
    UPDATE: "Registry.Update",
};

export default class Registry extends EventEmitter {
    constructor({ setter, getter, entries = [], state = {} } = {}) {
        super({
            entries: new Map(entries),
            // objects: new WeakMap(),     // This is there for whenever having access to { value: key } (sic) is important or useful
            getter: getter,
            setter: setter,
            
            ...state
        });
        this.id = uuidv4();
    }

    //? This allows this.get(key) to be modified dynamically to instead return this.state.entries.get(this.getter(key))
    get getter() {
        return this.state.getter;
    }
    set getter(fn) {
        if(typeof fn === "function") {
            this.mergeState({
                getter: fn,
            });
        }
    }

    //? This allows this.set(key, value) to be modified dynamically to instead execute this.state.entries.set(...this.setter(key, value))
    get setter() {
        return this.state.setter;
    }
    set setter(fn) {
        if(typeof fn === "function") {
            this.mergeState({
                setter: fn,
            });
        }
    }

    get entries() {
        return this.state.entries;
    }
    get objects() {
        return this.state.entries;
    }

    get size() {
        return this.entries.size;
    }

    get isEmpty() {
        return this.size === 0;
    }

    empty() {
        return this.entries.clear();
    }

    // oget(value) {
    //     return this.objects.get(value);
    // }
    get(key) {
        if(this.getter) {
            const k = this.getter(key);

            return this.entries.get(k);
        }

        return this.entries.get(key);
    }
    set(key, value, { suppress = false } = {}) {
        if(this.setter) {
            const [ k, v ] = this.setter(key, value);

            this.entries.set(k, v);

            // if(typeof v === "object") {
            //     this.objects.set(v, k);
            // }
        } else {
            this.entries.set(key, value);

            // if(typeof value === "object") {
            //     this.objects.set(value, key);
            // }
        }

        if(suppress !== true) {
            this.emit(EnumEventType.UPDATE, Date.now());
        }

        return this;
    }
    remove(key) {
        // this.objects.delete(this.entries.get(key));

        return this.entries.delete(key);
    }

    // ohas(value) {
    //     return this.objects.has(value);
    // }
    has(key) {
        return this.entries.has(key);
    }
    includes(value) {
        return [ ...this.entries.values() ].some(entry => entry === value);
    }

    merge(input, filter) {
        const setter = (key, value) => {            
            if(typeof filter === "function") {
                if(filter(key, value) === true) {
                    this.set(key, value);
                }
            } else {
                this.set(key, value);
            }
        };

        if(input instanceof Registry) {
            for(let [ key, value ] of input.entries) {
                setter(key, value);
            }
        } else if(input instanceof Map) {
            for(let [ key, value ] of input) {
                setter(key, value);
            }
        } else if(Array.isArray(input)) {
            for(let [ key, value ] of input) {
                if(key !== void 0 && value !== void 0) {
                    setter(key, value);
                }
            }
        } else if(typeof input === "object") {
            Object.entries(input).forEach(([ key, value ]) => setter(key, value));
        }

        return this;
    }

    each(fn, { save = false } = {}) {
        if(typeof fn === "function") {
            if(save === true) {
                for(let [ key, value ] of this.entries) {
                    this.set(key, fn.call(this, key, value), { suppress: true });
                }

                this.emit(EnumEventType.UPDATE, Date.now());
            } else {
                for(let [ key, value ] of this.entries) {
                    fn.call(this, key, value);
                }
            }
        }

        return this;
    }
};