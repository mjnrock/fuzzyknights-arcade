import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export const EnumEventType = {
    MOVE: "MOVE",
};

export default class Entity extends EventEmitter {
    constructor({ type, comps = [], id } = {}) {
        this.id = id || uuidv4();
        
        this.type = type;
        this.components = comps;
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