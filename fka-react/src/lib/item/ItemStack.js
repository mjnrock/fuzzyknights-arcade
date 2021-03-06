import { v4 as uuidv4 } from "uuid";
import Item from "./Item";

export default class ItemStack {
    constructor(item = null, qty = 1, { id } = {}) {
        this.id = id || uuidv4();

        this._item = item;
        this.qty = qty || 1;
    }

    get item() {
        return this._item;
    }
    set item(item) {
        if(item instanceof Item) {
            this._item = item;
        }

        return this;
    }

    get qty() {
        return this.quantity;
    }
    set qty(qty) {
        this.quantity = Math.max(0, Math.min(qty, this.item.maxStackSize));

        return this;
    }

    activate(...args) {
        if(this.item) {
            this.item.activate(...args);
        }
    }
}