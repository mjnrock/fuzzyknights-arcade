import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectMove extends Effect {
    constructor(pos = [ 0, 0 ], { method = "+", only, ignore } = {}) {
        super({
            type: EnumEffectType.MOVE,
            effect: function(ea, target) {
                const rb = target.getComponent(EnumComponentType.RIGID_BODY);

                if(rb) {
                    let x, y;
                    if(typeof pos === "function") {
                        [ x, y ] = pos(ea, target, rb);
                    } else {
                        [ x, y ] = pos;
                    }

                    if(method === "=") {
                        rb.x = x;
                        rb.y = y;
                    } else if(method === "+") {
                        rb.x += x;
                        rb.y += y;
                    } else if(method === "-") {
                        rb.x -= x;
                        rb.y -= y;
                    }
                }
            },
            only,
            ignore,
        });

        this.pos = pos;
    }
}