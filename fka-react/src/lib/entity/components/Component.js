import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { Enumerator } from "./../../hive/Helper";

export const EnumComponentType = Enumerator({
    RIGID_BODY: 2 << 0,
    STATE: 2 << 1,
});

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
                // console.log(prop, prop in target, target[ prop ]);
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
                } else {
                    target[ prop ] = value;
                }

                return target;
            }
        })
    }

    /**
     * <target> convenience getter
    */
    get _() {
        return this;
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