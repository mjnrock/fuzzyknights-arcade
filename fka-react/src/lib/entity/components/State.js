/* eslint-disable */
import Component, { EnumComponentType } from "./Component";
import Elapsable from "./lib/Elapsable";
import { EnumEvent as EnumElapsableEvent } from "./lib/Elapsable";

export const EnumState = {
    IDLE: "IDLE",
    MOVING: "MOVING",
    ATTACKING: "ATTACKING",
    DEFENDING: "DEFENDING",
    CASTING: "CASTING",
    PERFORMING: "PERFORMING",   // Generic "action" state, mostly just for non-Creatures (e.g. EntityItem, EntityParticle, etc.), when they "activate" (primarily for rendering)
    DYING: "DYING",
    DEAD: "DEAD",
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
            return this.state.default;
        }

        return this.state.present || this.state.default;
    }
    get currentValue() {
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

    clear() {
        this.sucessor = [];
        this.state.present = null;

        return this;
    }
};