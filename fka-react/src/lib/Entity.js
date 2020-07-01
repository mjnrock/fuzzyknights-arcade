import EventEmitter from "events";

export const EnumEventType = {
    MOVE: "MOVE",
};

export default class Entity extends EventEmitter {
    constructor({ type, x, y } = {}) {
        this.type = type;
        this.x = x;
        this.y = y;
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