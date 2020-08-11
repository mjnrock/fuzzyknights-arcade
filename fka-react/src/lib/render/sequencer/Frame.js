import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import Base64 from "./../../util/Base64";

//? "Filters" are expected to give fn(elapsedTime, frame, ...args)
export default class Frame {
    constructor({ duration = 1, source, filters = [] } = {}) {
        this.id = uuidv4();
        
        this._source = source;
        this.duration = duration;
        this.filters = filters;
    }

    get source() {
        let source = this._source;

        for(let fn of this.filters) {
            source = fn(source);
        }

        return source;
    }
    set source(source) {
        this._source = source;
    }

    addFilter(...fns) {
        for(let fn of fns) {
            if(typeof fn === "function") {
                this.filters.push(fn);
            }
        }

        return this;
    }
    removeFilter(...fns) {
        this.filters = this.filters.reduce((a, v) => {
            if(fns.includes(v)) {
                return a;
            }
            
            a.push(v);

            return a;
        }, this.filters);

        return this;
    }

    dec(amount = 0) {
        this.duration += amount;

        return this;
    }
    inc(amount = 0) {
        this.duration -= amount;

        return this;
    }
    /**
     * Make the duration 1/2x of the current durration
     * @param {number} factor 
     */
    half(factor = 1) {
        this.duration *= (2 * factor);

        return this;
    }
    /**
     * Make the duration 2x of the current durration
     * @param {number} factor 
     */
    double(factor = 1) {
        this.duration /= (2 * factor);

        return this;
    }

    async toCanvas() {
        return Base64.Decode(this.source).then(canvas => canvas);
    }

    async toData() {
        return new Promise((resolve, reject) => {
            resolve({
                id: this.id,
                source: this.source,
                duration: this.duration,
                filters: this.filters,
                hash: crypto.createHash("md5").update(this.source).digest("hex"),   //? Create a hash of this.source
            });
        });
    }
};