import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectKill extends Effect {
    constructor({ only, ignore } = {}) {
        super({
            type: EnumEffectType.DAMAGE,
            effect: function(entity) {
                const life = entity.getComponent(EnumComponentType.LIFE);

                if(life) {
                    life.HP.empty();
                    entity.isExpired = true;
                }
            },
            only,
            ignore,
        });
    }
}