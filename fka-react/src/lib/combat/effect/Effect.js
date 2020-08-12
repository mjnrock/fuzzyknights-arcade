import { Enumerator } from "../../hive/Helper";
import { Bitwise } from "./../../hive/Helper";
import EntityCreature from "./../../entity/EntityCreature";

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
    STATE: 2 << 9,
});

export default class Effect {
    /**
     * This is functionally an abstract class, and should be treated as such
     * @param {EnumEffectType} type | The flag of the Effect
     * @param {fn(ea, target)} effect | What the Effect will do upon being invoked
     * @param {EnumEntityType(s)|fn:bool} only [ 0 ] | Either an EnumEntityType bitmask or a function that only affects true-result entities
     * @param {EnumEntityType(s)|fn:bool} ignore [ 0 ] | Either an EnumEntityType bitmask or a function that ignores true-result entities
     * @param {bool} creaturesOnly [ true ] | A short-circuiting flag to bypass any non-EntityCreature.  @only and @ignore will follow, provided the target is an EntityCreature.  This must be flagged off if an Effect should affect other Entity types, as it is true by default.
     */
    constructor({ type, effect, only = 0, ignore = 0, creaturesOnly = true } = {}) {;
        this.type = type;
        this.effect = effect;

        this.only = only;
        this.ignore = ignore;

        this.config = {
            CreaturesOnly: creaturesOnly,
        };
    }

    //* Static helper functions for basic, common considerations
    static get OnlyInvoker() {
        return { only: (ea, target) => target === ea.parent };
    }
    static get IgnoreInvoker() {
        return { ignore: (ea, target) => target === ea.parent };
    }

    /**
     * If needed, @ea.parent will be the entity that invoked the Action
     * @param {EntityAction} ea 
     * @param {Entity} target 
     * @param  {...any} args 
     */
    affect(ea, target, ...args) {
        if(this.config.CreaturesOnly === true) {
            if(!(target instanceof EntityCreature)) {
                return this;
            }
        }

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