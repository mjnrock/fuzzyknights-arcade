import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectKill extends Effect {
    constructor({ only, ignore } = {}) {
        super({
            type: EnumEffectType.DAMAGE,
            effect: function(ea, target) {
                const life = target.getComponent(EnumComponentType.LIFE);

                if(life) {
                    life.HP.empty();
                    target.lifespan = 0;
                }
            },
            only,
            ignore,
        });
    }
}