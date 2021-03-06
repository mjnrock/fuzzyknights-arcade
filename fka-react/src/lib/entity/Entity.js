import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { Enumerator } from "./../hive/Helper";

import Game from "./../Game";
import RigidBody from "./components/RigidBody";
import State, { EnumState } from "./components/State";
import { EnumComponentType } from "./components/Component";
import Action from "../combat/Action";

export const EnumEventType = Enumerator({
    TICK: "Entity.Tick",
    COLLISION: "Entity.Collision",
    ACTION: "Entity.Action",
    INTERACTION: "Entity.Interaction",
    DIE: "Entity.Die",
});

export const EnumEntityType = Enumerator({
    CREATURE: 2 << 0,
    ACTION: 2 << 1,
    PARTICLE: 2 << 2,
    PORTAL: 2 << 3,
    PROJECTILE: 2 << 4,
    ITEM: 2 << 5,
});

export default class Entity extends EventEmitter {
    constructor({ type, comps = [], id, data = {}, lifespan = -1, parent, x, y, hooks = {} } = {}) {
        super();

        this.id = id || uuidv4();
        this.birth = Date.now();
        this.lifespan = lifespan;
        this.parent = parent;
        
        this.type = type;
        
        this.hooks = hooks;
        this._isExpired = false;

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

        if(x !== void 0  && y !== void 0) {
            const rb = this.getComponent(EnumComponentType.RIGID_BODY);
            rb.setCoords(x, y);
        }
    }

    get pos() {
        const rb = this.getComponent(EnumComponentType.RIGID_BODY);
        
        return rb.pos;
    }
    get node() {
        const rb = this.getComponent(EnumComponentType.RIGID_BODY);
        
        return rb.node;
    }

    comp(compType, fn, ...args) {
        const comp = this.getComponent(compType);

        if(comp && typeof fn === "function") {
            return fn.call(this, comp, ...args);
        }
    }

    hook(event, ...args) {
        if(typeof this.hooks[ event ] === "function") {
            this.hooks[ event ].call(this, ...args);
        }
    }

    perform(index, ...args) {
        const cap = this.getComponent(EnumComponentType.CAPABILITIES);

        if(cap && cap.check) {
            const action = cap.index(index);
            
            if(action instanceof Action && action.judge(this) === true) {
                const rb = this.getComponent(EnumComponentType.RIGID_BODY);

                cap.lock(action.cooldown);
                Game.$.send("entity", this, EnumEventType.ACTION, action, rb.x, rb.y, rb.facing, ...args);
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

        return (this.lifespan >= 0 && (this.birth + this.lifespan <= Date.now())) || (this._isExpired === true);
    }

    kill() {
        this._isExpired = true;
    }

    tick(dt, now) {
        Game.$.send("entity", this, EnumEventType.TICK, dt, now);

        return !this.isExpired;
    }
};