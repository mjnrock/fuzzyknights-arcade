import EventEmitter from "events";

export const EnumEvent = {
    START: "START",
    STOP: "STOP",
    EXPIRATION: "EXPIRATION",
    MUTATION: "MUTATION",
};

export default class Elapsable extends EventEmitter {
    constructor(duration = Infinity, { data = {}, mutator, startNow = false } = {}) {
        super();

        this.state = {
            duration,
            start: startNow === true ? Date.now() : null,

            mutator,
            ...data,
        };
    }

    get duration() {
        return this.state.duration;
    }
    get elapsed() {
        return Date.now() - this.state.start;
    }
    get expiration() {
        return this.state.start + this.state.duration;
    }

    get isComplete() {
        const result = Date.now() >= this.expiration;

        if(result === true) {
            const start = this.state.start;
            
            this.state.start = null;

            this.emit(EnumEvent.EXPIRATION, this.state, start);
        }

        return result;
    }

    start({ requestTimeout = false } = {}) {
        this.state.start = Date.now();

        if(requestTimeout === true) {
            setTimeout(() => {
                const start = this.state.start;
                
                this.stop();    
                this.emit(EnumEvent.EXPIRATION, this.state, start);
            }, this.duration);
        }

        this.emit(EnumEvent.START, this.state);

        return this;
    }
    stop() {
        this.state.start = null;

        this.emit(EnumEvent.STOP, this.state);

        return this;
    }

    mutate(...args) {
        if(typeof this.mutator === "function") {
            this.state = this.mutator(...args) || this.state;

            this.emit(EnumEvent.MUTATION, this.state, args);
        }

        return this;
    }
}