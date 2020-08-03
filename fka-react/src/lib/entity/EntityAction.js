import Entity, { EnumEntityType } from "./Entity";
import { EnumComponentType } from "./components/Component";

export default class EntityAction extends Entity {
    constructor({ action, data, x, y, parent } = {}) {
        super({
            type: EnumEntityType.ACTION,
            data,
            lifespan: action.lifespan,
            parent,
        });

        if(x !== void 0  && y !== void 0) {
            const rb = this.getComponent(EnumComponentType.RIGID_BODY);
            rb.setCoords(x, y);
        }

        this.action = action;
    }
}