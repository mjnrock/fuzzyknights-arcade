import EffectMove from "./EffectMove";
import { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectKnockback extends EffectMove {
    constructor(factor = 0.025, { only, ignore } = {}) {
        super((ea, target) => {
                const rb = ea.parent.getComponent(EnumComponentType.RIGID_BODY);

                if(rb) {
                    const comp = target.getComponent(EnumComponentType.RIGID_BODY);
                    
                    if(comp) {
                        comp.facing = (rb.facing + 180) % 360;
                    }

                    return rb.facingXY(true).map(v => v * factor);
                }

                return [ 0, 0 ];
            }, {
            type: EnumEffectType.MOVE,  // sic, this is just a special case of MOVE
            method: "+",
            only,
            ignore,
        });

        this.factor = factor;
    }
}