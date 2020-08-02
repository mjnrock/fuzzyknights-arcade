import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectSpawn extends Effect {
    constructor({ node, x, y, entity, only, ignore } = {}) {
        super({
            type: EnumEffectType.SPAWN,
            effect: function() {
                if(x !== void 0 && y !== void 0) {
                    const rb = entity.getComponent(EnumComponentType.RIGID_BODY);

                    rb.x = x;
                    rb.y = y;
                }

                node.addEntity(entity);
            },
            only,
            ignore,
        });
    }
}