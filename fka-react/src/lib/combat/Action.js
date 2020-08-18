import { Enumerator } from "./../hive/Helper";
import Ability from "./Ability";
import { EnumComponentType } from "../entity/components/Component";

export const EnumActionType = Enumerator({
    ABILITY: 2 << 0,
    INTERACT: 2 << 1,
});

export const MINIMUM_LOCKOUT = 150;

export default class Action {
    /**
     * @param {EnumActionType} type | The type of action, either to signify an Ability usage or as an interaction event (e.g. Portals)
     * @param {Ability|fn} consequence | What happens as a result of the Action being performed
     * @param {int} lifespan [ 1 (ms) ] | Using @lifespan = 1 will functionally hold the Action for 1 game tick (i.e. singular application); use a longer lifespan if a HoT/DoT effect is desired
     * @param {Model|fn(entity):Model} model | The model to use for the spawned EntityAction (if a fn is used, EntityManager will run the function before spawning the EntityAction)
     * @param {EnumState} state | The state that the invoker will invoke by using the Action (e.g. ATTACKING)
     * @param {?fn(ea, target, ...args)} pre | A hook function to run before @consequence
     * @param {?fn(ea, target, ...args)} post | A hook function to run after @consequence
     * @param {?fn(ea, target, ...args)} conditional | A hook function to determine if @consequence should be run
     */
    constructor({ type, consequence, lifespan = 1, model, state, pre, post, conditional, name } = {}) {
        this.type = type;
        this.consequence = consequence;
        this.name = name;
        this.lifespan = lifespan;
        this.model = model;
        this.compState = state;

        this.hooks = {
            conditional,
            pre,
            post,
        };
    }

    get lockout() {
        return Date.now() + (this.consequence instanceof Ability ? this.consequence.duration : MINIMUM_LOCKOUT);
    }

    static Ability({ requirements, effects, duration, ...opts } = {}) {
        return new Action({
            type: EnumActionType.ABILITY,
            consequence: new Ability(
                requirements,
                effects,
                duration,
            ),

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

    judge(entity, ...args) {
        if(this.type === EnumActionType.ABILITY) {
            return this.consequence.judge(entity, ...args);
        } else if(this.type === EnumActionType.INTERACT) {
            //TODO
            return true;
        }

        return false;
    }

    execute(ea, target, ...args) {
        if(typeof this.hooks.conditional === "function") {
            if(this.hooks.conditional(ea, target, ...args) !== true) {
                return false;
            }
        }

        if(typeof this.hooks.pre === "function") {
            this.hooks.pre(ea, target, ...args);
        }

        if(this.type === EnumActionType.ABILITY) {
            const state = ea.parent.getComponent(EnumComponentType.STATE);

            if(state) {
                state.set(this.compState, this.consequence.duration);    //TODO Change duration to a lookup value based on the Action/Ability
            }

            this.consequence.affect(ea, target, ...args);
        } else if(this.type === EnumActionType.INTERACT) {
            // TODO
        }

        if(typeof this.hooks.post === "function") {
            this.hooks.post(ea, target, ...args);
        }
    }
};