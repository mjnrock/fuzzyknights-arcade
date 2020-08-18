import Entity, { EnumEntityType } from "./Entity";
import { EnumComponentType } from "./components/Component";
import Life from "./components/Life";
import Attributes from "./components/Attributes";

export default class EntityCreature extends Entity {
    constructor({ comps = [], id, data = {}, lifespan = -1, parent, x, y } = {}) {
        super({
            id,
            data,
            x, y,
            lifespan,
            parent,
            type: EnumEntityType.CREATURE,
            comps: [
                new Life({ hp: [ 10, 0, 10 ], energy: [ 50, 0, 50 ] }),
                new Attributes(),

                ...comps
            ]
        });
    }

    get isDead() {
        return this.getComponent(EnumComponentType.LIFE).isDead;
    }
    get isExpired() {
        return super.isExpired || this.isDead;
    }
}; 