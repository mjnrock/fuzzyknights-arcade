import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { Bitwise } from "./../../hive/Helper";

export const EnumComponentType = {
    LOCATION: 2 << 0,

    flagToName(flag) {
        for(let name in EnumComponentType) {
            if(EnumComponentType[ name ] === flag) {
                return name;
            }
        }

        return null;
    },
    maskToNames(mask) {
        let names = [];

        for(let name in EnumComponentType) {
            if(Bitwise.has(mask, EnumComponentType[ name ])) {
                names.push(name);
            }
        }

        return names;
    }
};

export const EnumEventType = {
    UPDATE: "UPDATE",
};

export default class Component extends EventEmitter {
    constructor(flag, state = {}, { id } = {}) {
        super();

        this.id = id || uuidv4();
        this.flag = flag;
        this.state = state;

        return new Proxy(this, {
            get: (target, prop) => {
                if(prop in target) {
                    return target[ prop ];
                }

                if(prop in this.state) {
                    return this.state[ prop ];
                }

                return target;
            },
            set: (target, prop, value) => {
                if(prop in this.state) {
                    this.state[ prop ] = value;
                }

                return target;
            }
        })
    }

    merge(prop, input) {
        if(Array.isArray(this.state[ prop ])) {
            this.state[ prop ] = [
                ...this.state[ prop ],
                ...(input || [])
            ];
        } else if(typeof this.state[ prop ] === "object") {
            this.state[ prop ] = {
                ...this.state[ prop ],
                ...(input || {}),
            };
        } else {
            this.state[ prop ] = input;
        }
    }
};