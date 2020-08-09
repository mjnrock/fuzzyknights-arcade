/* eslint-disable */
import Component, { EnumComponentType } from "./Component";
import Elapsable from "./lib/Elapsable";
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

export const EnumEvent = {
    STATE_CHANGE: "State.StateChange",
};

export default class State extends Component {
    constructor({ defaultState, currentState } = {}) {
        super(EnumComponentType.STATE, {
            default: defaultState || new Elapsable(Infinity, {
                data: {
                    value: EnumState.IDLE,
                },
                startNow: true,
            }),
            present: currentState,
        });

        this.sucessor = [];
        this.handler = () => null;
    }

    get isExpired() {
        if(!this.state.present) {
            return true;
        }

        return this.state.present.isComplete;
    }

    get current() {
        if(!this.state.present) {
            return this.state.default.state.value;
        }

        return this.state.present.state.value || this.state.default.state.value;
    }

    /**
     * 
     * @param {int|Elapsable} data 
     * @param {int} duration 
     * @param  {...[ [ mask, duration ] ]} progressions 
     */
    set(data, duration, ...progressions) {
        if(data instanceof Elapsable) {
            this.state.present = data;
        } else {
            this.state.present = new Elapsable(duration, {
                data: {
                    value: data,
                },
            });

        }
        this.state.present.on(EnumElapsableEvent.EXPIRATION, () => this.expire());
        this.state.present.start();

        const arr = [];
        for(let [ m, d ] of progressions) {
            arr.push(new Elapsable(d, {
                data: {
                    value: m,
                },
            }));
        }

        if(arr.length) {
            arr.reverse();
            this.sucessor = arr;
        }

        console.log(this.state.present.state.value, this.state.present.birth, this.state.present.expiration);

        return this;
    }

    add(...progressions) {
        const params = [ ...progressions.shift(), ...progressions ];
        this.set(...params);

        return this;
    }

    expire() {
        if(this.sucessor.length) {
            const elapser = this.sucessor.pop();

            this.set(elapser);
        } else {
            this.state.present = null;
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