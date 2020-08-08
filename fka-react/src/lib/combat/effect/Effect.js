import { Enumerator } from "../../hive/Helper";
import { Bitwise } from "./../../hive/Helper";

export const EnumEffectType = Enumerator({
    DAMAGE: 2 << 0,
    HEAL: 2 << 1,
    DRAIN: 2 << 2,
    GAIN: 2 << 3,
    BUFF: 2 << 4,
    DEBUFF: 2 << 5,
    KILL: 2 << 6,
    SPAWN: 2 << 7,
    MOVE: 2 << 8,
});

export default class Effect {
    constructor({ type, effect, only = 0, ignore = 0 } = {}) {;
        this.type = type;
        this.effect = effect;

        this.only = only;
        this.ignore = ignore;
    }

    affect(ea, target, ...args) {
        if(typeof this.only === "number" && this.only !== 0) {
            if(Bitwise.has(this.only, target.type)) {
                this.effect(ea, target, ...args);
            }
        } else if(typeof this.ignore === "number" && this.ignore !== 0) {
            if(!Bitwise.has(this.ignore, target.type)) {
                this.effect(ea, target, ...args);
            }
        } else if(typeof this.only === "function") {
            if(this.only(ea, target) === true) {
                this.effect(ea, target, ...args);
            }
        } else if(typeof this.ignore === "function") {
            if(this.ignore(ea, target) === false) {
                this.effect(ea, target, ...args);
            }
        } else {
            this.effect(ea, target, ...args);
        }

        return this;
    }
};