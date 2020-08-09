import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectState extends Effect {
    constructor(progressions, { only, ignore } = {}) {
        super({
            type: EnumEffectType.STATE,
            effect: function(ea, target) {
                const state = target.getComponent(EnumComponentType.STATE);

                if(state) {
                    state.add(...progressions);
                }
            },
            only,
            ignore,
        });
    }
}