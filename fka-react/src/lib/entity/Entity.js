import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { Enumerator } from "./../hive/Helper";

import RigidBody from "./components/RigidBody";
import { EnumComponentType } from "./components/Component";

export const EnumEventType = Enumerator({
    TICK: "Entity.Tick",
});

export const EnumEntityType = Enumerator({
    CREATURE: 2 << 0,
    ACTION: 2 << 1,
});

export default class Entity extends EventEmitter {
    constructor({ type, comps = [], id, data = {}, lifespan = -1 } = {}) {
        super();

        this.id = id || uuidv4();
        this.birth = Date.now();
        this.lifespan = lifespan;
        
        this.type = type;

        this.components = [
            ...comps,

            new RigidBody(),
        ];

        for(let flag of Object.keys(data)) {
            const comp = this.getComponent(~~flag);

            if(comp) {
                for(let [ key, value ] of Object.entries(data[ flag ])) {
                    comp[ key ] = value;
                }
            }
        }
    }

    get pos() {
        const rb = this.getComponent(EnumComponentType.RIGID_BODY);
        
        return rb.pos;
    }

    getComponent(flag) {
        for(let comp of this.components) {
            if(comp.flag === flag) {
                return comp;
            }
        }

        return null;
    }

    get isExpired() {
        return this.lifespan > 0 && (this.birth + this.lifespan <= Date.now());
    }

    tick(dt, game) {
        if(!this.isExpired) {
            const comp = this.getComponent(EnumComponentType.RIGID_BODY);
            
            comp.isColliding = false;
            comp.x += comp.vx * dt;
            comp.y += comp.vy * dt;

            if(game) {
                game.channel("entity").invoke(this, EnumEventType.TICK, dt, game);
            }
        }

        return !this.isExpired;
    }
}; 