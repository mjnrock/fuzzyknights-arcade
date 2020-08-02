import Hive from "@lespantsfancy/hive";
import { v4 as uuidv4 } from "uuid";

export default class Propagator extends Hive.Node {
    constructor({ subscribors = [], state  = {}, config = {} } = {}) {
        super({
            subscribors: new Map(subscribors),         

            ...state,
        });

        this.id = uuidv4();

        this.mergeConfig({            
            ...config,
        });
    }

    get subscribors() {
        return this.state.subscribors;
    }
    set subscribors(subscribors = {}) {
        this.mergeState({
            ...subscribors,
        });
    }

    invoke(thisArg, type, ...args) {
        for(let [ fn, obj ] of this.subscribors.entries()) {
            if(obj.type === "only" && obj.entries.includes(type)) {
                fn(thisArg, type, ...args);
            } else if(obj.type === "ignore" && !obj.entries.includes(type)) {
                fn(thisArg, type, ...args);
            }
        }
    }

    join(fn, { only = [], ignore = [] } = {}) {
        if(typeof fn === "function") {
            if(only.length) {
                this.subscribors.set(fn, { type: "only", entries: only });
            } else if(ignore.length) {
                this.subscribors.set(fn, { type: "ignore", entries: ignore });
            } else {                
                this.subscribors.set(fn, { type: "ignore", entries: [] });
            }
        }
    }
    leave(fn) {
        this.subscribors.delete(fn);
    }
}