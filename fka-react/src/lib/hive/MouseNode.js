import Hive from "@lespantsfancy/hive";
import { Bitwise } from "./Helper";

export const EnumEventType = {
    MOUSE_MASK: "MOUSE_MASK",
    MOUSE_DOWN: "MOUSE_DOWN",
    MOUSE_UP: "MOUSE_UP",
};

export default class MouseNode extends Hive.Node {
    constructor({ element } = {}) {
        super();

        this._config = {
            ...this.config,
            allowComplexActions: false,
        };

        this.state = {
            map: [
                {
                    button: 0,
                    flag: 2 << 0,
                    name: "LEFT",
                },
                {
                    button: 1,
                    flag: 2 << 1,
                    name: "MIDDLE",
                },
                {
                    button: 2,
                    flag: 2 << 2,
                    name: "RIGHT",
                },
            ],
            mask: 0,
        };

        if(element) {
            element.onmousedown = e => this.onMouseDown.call(this, e);
            element.onmouseup = e => this.onMouseUp.call(this, e);
        }
    }

    getMousePosition(e) {
        return {
            x: e.x,
            y: e.y
        };
    }

    updateMask(e) {
        let mask = this.state.mask;

        for(let entry of this.state.map) {
            if(entry.button === e.button) {
                if(Bitwise.has(mask, entry.flag)) {
                    mask = Bitwise.remove(mask, entry.flag);
                } else {
                    mask = Bitwise.add(mask, entry.flag)
                }
            }
        }
        this.state = {
            ...this.state,
            mask
        };

        if(this.config.allowComplexActions === true) {
            this.dispatch(EnumEventType.MOUSE_MASK, this.state.mask);
        }
    }

    onMouseDown(e) {
        e.preventDefault();

        this.updateMask(e);
        this.dispatch(EnumEventType.MOUSE_DOWN, e);
    }
    onMouseUp(e) {
        e.preventDefault();

        this.updateMask(e);
        this.dispatch(EnumEventType.MOUSE_UP, e);
    }
}