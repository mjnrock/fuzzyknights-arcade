import Entity from "./Entity";
import Life from "./components/Life";
import Attributes from "./components/Attributes";

export default class EntityCreature extends Entity {
    constructor() {
        super({
            comps: [
                new Life({ hp: [ 10, 0, 10 ], mana: [ 5, 0, 5 ] }),
                new Attributes(),
            ]
        });
    }

    // tick(dt) {
    //     const isAlive = super.tick(dt);
    // }
}; 