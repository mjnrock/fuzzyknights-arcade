import CanvasNode from "./CanvasNode";

export const EnumMessageType = {};

export default class FKanvasNode extends CanvasNode {
    constructor({ state = {}, config = {}, width, height, tw, th } = {}) {
        super({ state, config, width, height });

        this.mergeState({
            tile: {
                width: tw,
                height: th,
            }
        });
    }

    grid(tx, ty, { tw, th, fn } = {}) {
        const tile = {
            width: tw || this.state.tile.width,
            height: th || this.state.tile.height,
        };
        const pos = {
            x: tx * tile.width,
            y: ty * tile.height,
        };

        if(typeof fn === "function") {
            fn(pos);
        }

        return pos;
    }
}