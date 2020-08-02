import { Enumerator } from "./../hive/Helper";

export const EnumActionType = Enumerator({
    ABILITY: 2 << 0,
    INTERACT: 2 << 1,
});

export const Ability = (ability) => new Action({
    type: EnumActionType.ABILITY,
    consequence: ability,
});
export const Interact = (fn) => new Action({
    type: EnumActionType.INTERACT,
    consequence: fn,
});

export default class Action {
    constructor({ type, consequence, pre, post, conditional } = {}) {
        this.type = type;
        this.consequence = consequence;
        this.hooks = {
            conditional,
            pre,
            post,
        };
    }
    
    execute(entity, ...args) {
        if(typeof this.hooks.conditional === "function") {
            if(this.hooks.conditional(entity, ...args) !== true) {
                return false;
            }
        }

        if(typeof this.hooks.pre === "function") {
            this.hooks.pre(entity, ...args);
        }

        if(this.type === EnumActionType.ABILITY) {
            this.consequence.affect(entity, ...args);
        } else if(this.type === EnumActionType.INTERACT) {
            // TODO
        }

        if(typeof this.hooks.post === "function") {
            this.hooks.post(entity, ...args);
        }
    }
};