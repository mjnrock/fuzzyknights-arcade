import Entity, { EnumEntityType } from "./Entity";
import { EnumComponentType } from "./components/Component";

export default class EntityPortal extends Entity {
    constructor({ data, x, y, parent } = {}) {
        super({
            type: EnumEntityType.PORTAL,
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