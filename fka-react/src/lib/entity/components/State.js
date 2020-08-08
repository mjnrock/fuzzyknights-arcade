import Component, { EnumComponentType } from "./Component";
import Elapsable, { EnumEvent } from "./lib/Elapsable";
import { EnumEvent as EnumElapsableEvent } from "./lib/Elapsable";

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
     * @param {int|Elapsable} maskOrElapsable 
     * @param {int} duration 
     * @param  {...[ [ mask, duration ] ]} progression 
     */
    set(maskOrElapsable, duration, ...progression) {
        if(maskOrElapsable instanceof Elapsable) {
            this.present = maskOrElapsable;
        } else {
            this.present = new Elapsable(duration, {
                state: {
                    data: maskOrElapsable,
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

    expire() {
        this.present = null;

        if(this.sucessor.length) {
            this.set(this.sucessor.shift());
            this.present.start();
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