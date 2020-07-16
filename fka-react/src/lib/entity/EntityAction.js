import Entity from "./Entity";
import { EnumComponentType } from "./components/Component";

export default class EntityAction extends Entity {
    constructor({ data, x, y, lifespan = 2000 } = {}) {
        super({ data, lifespan });

        if(x !== void 0  && y !== void 0) {
            const rb = this.getComponent(EnumComponentType.RIGID_BODY);
            rb.setCoords(x, y);
        }

        this.ability = null;
    }
}