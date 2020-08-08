import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectSpawn extends Effect {
    constructor(node, { only, ignore } = {}) {
        super({
            type: EnumEffectType.SPAWN,
            effect: function(ea, target, x, y) {
                if(x !== void 0 && y !== void 0) {
                    const rb = target.getComponent(EnumComponentType.RIGID_BODY);

                    rb.x = x;
                    rb.y = y;
                }

                node.addEntity(target);
            },
            only,
            ignore,
        });
    }
}