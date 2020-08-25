import Slot from "./Slot";

export default class Inventory {
    constructor(size, { content = [] } = {}) {
        this.size = size || 1;
        this.content = new Map();

        for(let i = 0; i < this.size; i++) {
            this.content.set(i, new Slot());
        }
    }

    slot(index) {
        if(index >= 0 && index < this.size) {
            return this.content.get(index);
        }
    }
    item(index) {
        const slot = this.slot(index);

        if(slot) {
            return slot.item;
        }
    }
}