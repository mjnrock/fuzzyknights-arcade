import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";
import { EnumState } from "../../entity/components/State";

export default class EffectKill extends Effect {
    constructor({ only, ignore } = {}) {
        super({
            type: EnumEffectType.KILL,
            effect: function(ea, target) {
                const state = target.getComponent(EnumComponentType.STATE);

                if(state) {
                    state.set(EnumState.DEAD, Infinity);
                }
            },
            only,
            ignore,
        });
    }
}