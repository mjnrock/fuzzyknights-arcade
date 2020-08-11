import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { Enumerator } from "./../hive/Helper";

import RigidBody from "./components/RigidBody";
import State, { EnumState } from "./components/State";
import { EnumComponentType } from "./components/Component";
import Action from "../combat/Action";

export const EnumEventType = Enumerator({
    TICK: "Entity.Tick",
    COLLISION: "Entity.Collision",
    ACTION: "Entity.Action",
});

export const EnumEntityType = Enumerator({
    CREATURE: 2 << 0,
    ACTION: 2 << 1,
    PARTICLE: 2 << 2,
    PORTAL: 2 << 3,
});

export default class Entity extends EventEmitter {
    constructor({ type, comps = [], id, data = {}, lifespan = -1, parent } = {}) {
        super();

        this.id = id || uuidv4();
        this.birth = Date.now();
        this.lifespan = lifespan;
        this.parent = parent;
        
        this.type = type;

        this.components = [
            ...comps,

            new State(),
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

    //TODO Modify this to create an action queue in a component, have tick perform all actions in queue
    perform(game, action, ...args) {
        if(action instanceof Action) {
            const rb = this.getComponent(EnumComponentType.RIGID_BODY);
            const life = this.getComponent(EnumComponentType.LIFE);
            
            //NOTE Modify the life.MANA necessity as other resources are introduced
            if(rb && life && life.MANA.subtract(action.cost, true)) {
                game.send("entity", this, EnumEventType.ACTION, action, rb.x, rb.y, rb.facing, ...args);
            }
        }
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
        const state = this.getComponent(EnumComponentType.STATE);

        if(state && state.current === EnumState.DEAD) {
            return true;
        }

        return this.lifespan > 0 && (this.birth + this.lifespan <= Date.now());
    }

    tick(dt, game) {
        if(game) {
            game.send("entity", this, EnumEventType.TICK, dt, game);

            return !this.isExpired;
        }

        return false;
    }
};