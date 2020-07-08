import EventEmitter from "events";
import Hive from "@lespantsfancy/hive";

export const EnumEventType = {
    RESIZE: "Component.Resize",
}

export default class Component extends EventEmitter {
    constructor({ width = 1, height = 1 } = {}) {
        this.width = width;
        this.height = height;
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