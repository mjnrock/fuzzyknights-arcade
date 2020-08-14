import Slot from "./Slot";

//! -------------------------------------------------
//TODO This should use Slot as its workhorse (also in .get, .set, .remove, etc.)
//! -------------------------------------------------
export default class Inventory {
    constructor(size, { content = [] } = {}) {
        this.size = size || 1;
        this.content = new Map(content);

        if(!content.length) {
            for(let i = 0; i < this.size; i++) {
                this.content.set(i, new Slot());
            }
        }
    }

    get(index) {
        return this.content.get(index);
    }
    set(index, item) {
        this.content.set(index, item);

        return this;
    }
    swap(i0, i1) {
        const zero = this.get(i0);

        this.set(i0, this.get(i1));
        this.set(i1, zero);

        return this;
    }
    remove(index) {
        this.content.delete(index);
    }
    
    getItem(index) {
        return this.get(index).item;
    }
}