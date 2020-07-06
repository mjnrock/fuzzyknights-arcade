import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export const EnumEventType = {
    MOVE: "MOVE",
};

export default class Entity extends EventEmitter {
    constructor({ type, x, y } = {}) {
        this.id = uuidv4();
        
        this.type = type;
        this.x = x;
        this.y = y;
    }

    get tile() {
        return {
            x: Math.floor(this.x),
            y: Math.floor(this.y),
        };
    }

    setPos(x, y) {
        const old = [ this.x, this.y ];
        this.x = ~~x;
        this.y = ~~y;

        this.emit(EnumEventType.MOVE, {
            from: old,
            to: [ this.x, this.y ]
        });
    }
};