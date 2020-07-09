import EventEmitter from "events";
import Hive from "@lespantsfancy/hive";

export const EnumEventType = {
    RESIZE: "Component.Resize",
    MOVE: "Component.Move",
}

export default class Component extends EventEmitter {
    constructor({ x, y, width = 1, height = 1 } = {}) {
        super();
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    move(x, y) {
        const old = {
            x: this.x,
            y: this.y,
        };

        this.x = x;
        this.y = y;

        this.emit(EnumEventType.MOVE, {
            from: old,
            to: {
                x,
                y
            }
        });
    }
    resize(width, height) {
        this.width = width;
        this.height = height;

        this.emit(EnumEventType.RESIZE, {
            width,
            height,
        });
    }

    receive(msg) {
        if(Hive.Message.Conforms(msg)) {
            //TODO
        }
    }
};