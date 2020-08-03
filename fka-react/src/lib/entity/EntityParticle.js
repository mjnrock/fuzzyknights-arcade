import Entity, { EnumEntityType } from "./Entity";
import { EnumComponentType } from "./components/Component";

//TODO Pass the actual particle into the consutrctor
export default class EntityParticle extends Entity {
    constructor({ lifespan = 750, data, x, y, parent } = {}) {
        super({
            type: EnumEntityType.PARTICLE,
            data,
            lifespan,
            parent,
        });

        if(x !== void 0  && y !== void 0) {
            const rb = this.getComponent(EnumComponentType.RIGID_BODY);
            rb.setCoords(x, y);
        }
    }
}