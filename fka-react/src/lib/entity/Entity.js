import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

import Position from "./components/Position";
import { EnumComponentType } from "./components/Component";

export const EnumEventType = {
    MOVE: "MOVE",
};

export default class Entity extends EventEmitter {
    constructor({ type, comps = [], id, data = {} } = {}) {
        super();

        this.id = id || uuidv4();
        
        this.type = type;

        this.components = [
            ...comps,

            new Position(),
        ];

        for(let flag of Object.keys(data)) {
            const comp = this.getComponent(~~flag);

            if(comp) {
                console.warn(comp);
                for(let [ key, value ] of Object.entries(data[ flag ])) {
                    comp[ key ] = value;
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

    tick(dt) {
        const comp = this.getComponent(EnumComponentType.POSITION);
        
        comp.x += comp.vx;
        comp.y += comp.vy;
    }
}; 