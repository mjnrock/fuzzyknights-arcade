import Entity, { EnumEntityType } from "./Entity";

//TODO Pass the actual particle into the consutrctor
export default class EntityParticle extends Entity {
    constructor({ lifespan = 750, data, x, y, parent } = {}) {
        super({
            type: EnumEntityType.PARTICLE,
            data,
            x, y,
            lifespan,
            parent,
        });
    }
}