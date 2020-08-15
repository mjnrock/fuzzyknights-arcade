import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectSpawn extends Effect {
    constructor(entity, { only, ignore, x, y, fn } = {}) {
        super({
            type: EnumEffectType.SPAWN,
            effect: function(ea, target) {
                const ent = entity();
                const comp = ea.parent.getComponent(EnumComponentType.RIGID_BODY);
                const rb = ent.getComponent(EnumComponentType.RIGID_BODY);

                if(comp && rb) {
                    comp.node.addEntity(ent);      //TODO This might be serialized at some point, so refactor to use a Node Lookup in the current Game.Graph                    
    
                    if(typeof fn === "function") {
                        const [ nx, ny ] = fn(ea, target);
                        rb.x = nx;
                        rb.y = ny;
                    } else {
                        rb.x = typeof x === "number" ? x : comp.x;
                        rb.y = typeof y === "number" ? y : comp.y;
                    }

                    rb.facing = comp.facing;

                    const [ vx, vy ] = rb.facingXY(true);
                    rb.vx = vx * rb.speed;
                    rb.vy = vy * rb.speed;
                }
            },
            only,
            ignore,
        });
    }
}