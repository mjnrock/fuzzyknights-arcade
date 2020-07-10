import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

import Position from "./components/Position";

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
}; 