import Entity, { EnumEntityType } from "./Entity";

export default class EntityPortal extends Entity {
    constructor({ data, x, y, parent } = {}) {
        super({
            type: EnumEntityType.PORTAL,
            data,
            x, y,
            lifespan,
            parent,
        });
    }
}