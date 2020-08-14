import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { Enumerator } from "./../hive/Helper";

import RigidBody from "./components/RigidBody";
import State, { EnumState } from "./components/State";
import { EnumComponentType } from "./components/Component";
import Action from "../combat/Action";
import { EnumResourceType } from "./components/Life";

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

    perform(game, index, ...args) {
        const cap = this.getComponent(EnumComponentType.CAPABILITIES);

        if(cap) {
            const action = cap.index(index);
            
            if(action instanceof Action) {
                const rb = this.getComponent(EnumComponentType.RIGID_BODY);
                const life = this.getComponent(EnumComponentType.LIFE);
                
                //TODO Refactor this once "Requirements" are added to Abilities
                if(rb && life) {
                    if(Array.isArray(action.cost)) {
                        if(life[ EnumResourceType.flagToName(action.cost[ 1 ]) ].subtract(action.cost[ 0 ], true)) {
                            game.send("entity", this, EnumEventType.ACTION, action, rb.x, rb.y, rb.facing, ...args);
                        }
                    } else if(action.cost === 0) {
                        game.send("entity", this, EnumEventType.ACTION, action, rb.x, rb.y, rb.facing, ...args);
                    }
                }
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

    tick(dt, now, game) {
        if(game) {
            game.send("entity", this, EnumEventType.TICK, dt, game);

            return !this.isExpired;
        }

        return false;
    }
};