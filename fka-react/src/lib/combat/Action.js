import { Enumerator } from "./../hive/Helper";

export const EnumActionType = Enumerator({
    ABILITY: 2 << 0,
    INTERACT: 2 << 1,
});

export default class Action {
    constructor({ type, consequence, lifespan, model, pre, post, conditional } = {}) {
        this.type = type;
        this.consequence = consequence;
        this.lifespan = lifespan;
        this.model = model;

        this.hooks = {
            conditional,
            pre,
            post,
        };
    }    

    static Ability(ability, opts = {}) {
        return new Action({
            type: EnumActionType.ABILITY,
            consequence: ability,

            ...opts,
        });
    }
    static Interact(fn, opts = {}) {
        return new Action({
            type: EnumActionType.INTERACT,
            consequence: fn,

            ...opts,
        });
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