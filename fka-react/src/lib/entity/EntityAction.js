import Entity, { EnumEntityType } from "./Entity";

export default class EntityAction extends Entity {
    constructor({ action, data, x, y, parent } = {}) {
        super({
            type: EnumEntityType.ACTION,
            data,
            x, y,
            lifespan: action.lifespan,
            parent,
        });

        this.action = action;
    }
}