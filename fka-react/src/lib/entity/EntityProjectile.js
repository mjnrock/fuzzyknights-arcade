import Entity, { EnumEntityType } from "./Entity";
import Models from "./../model/package";
import Elapsable from "./components/lib/Elapsable";
import { EnumComponentType } from "./components/Component";
import { EnumState } from "./components/State";

export default class EntityProjectile extends Entity {
    constructor({ lifespan = -1, data, x, y, vx = 0, vy = 0, speed, model, parent, hooks } = {}) {
        super({
            type: EnumEntityType.PROJECTILE,
            data,
            model,
            x, y,
            lifespan,
            hooks,
            parent,
        });

        const rb = this.getComponent(EnumComponentType.RIGID_BODY);
        rb.setVelocity(vx, vy);
        rb.speed = speed;
        rb.model = model instanceof Models.Model ? model : new Models.Circle(...model);
        
        const state = this.getComponent(EnumComponentType.STATE);
        state.state.default = new Elapsable(Infinity, {
            data: {
                value: EnumState.MOVING,
            },
            startNow: true,
        });
    }
}