import Component, { EnumComponentType } from "./Component";
import Elapsable from "./lib/Elapsable";
import { EnumEvent as EnumElapsableEvent } from "./lib/Elapsable";
import { EnumEventType } from "@lespantsfancy/hive/lib/Node";

export const EnumState = {
    IDLE: "IDLE",
    WALKING: "WALKING",
    ATTACKING: "ATTACKING",
    DEFENDING: "DEFENDING",
    CASTING: "CASTING",
    DYING: "DYING",
    DEAD: "DEAD",
};

export const EnumCondition = {
    NORMAL: "NORMAL",
    WEAK: "WEAK",
};

export const EnumEvent = {
    STATE_CHANGE: "State.StateChange",
};

export default class State extends Component {
    constructor({ defaultState, currentState, condition } = {}) {
        super(EnumComponentType.STATE, {
            default: defaultState || new Elapsable(Infinity, {
                data: {
                    value: EnumState.IDLE,
                },
                startNow: true,
            }),
            present: currentState,
            condition,
        });

        this.sucessor = [];
        this.handler = () => null;
    }

    get isExpired() {
        if(!this.present) {
            return true;
        }

        return this.present.isComplete;
    }

    get current() {
        if(!this.present) {
            return this.default.data.value;
        }

        return this.present.data.value && this.default.data.value;
    }

    /**
     * 
     * @param {int|Elapsable} data 
     * @param {int} duration 
     * @param  {...[ [ mask, duration ] ]} progression 
     */
    set(data, duration, ...progression) {
        if(data instanceof Elapsable) {
            this.present = data;
        } else {
            this.present = new Elapsable(duration, {
                state: {
                    data: data,
                },
                startNow: true,
            });
        }
        this.present.on(EnumElapsableEvent.EXPIRATION, () => this.expire());

        const arr = [];
        for(let [ m, d ] of progression) {
            arr.push(new Elapsable(d, {
                state: {
                    data: m,
                },
            }));
        }

        if(arr.length) {
            this.sucessor = arr;
        }

        return this;
    }

    add(...progressions) {
        for(let progs of progressions) {
            this.set(...progs);
        }

        return this;
    }

    expire() {
        this.present = null;

        if(this.sucessor.length) {
            this.set(this.sucessor.shift());
            this.present.start();

            this.emit(EnumEvent.STATE_CHANGE, this.current);
        }

        return this;
    }

    check() {
        if(this.isExpired === true) {
            this.expire();
        }

        return this.current;
    }
};