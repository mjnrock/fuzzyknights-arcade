import ItemStack from "./ItemStack";
import Item from "./Item";

//? An Inventory with a specific type should still be enforced at the Slot level, with [].every()-inspired setup
export default class Slot {
    constructor(item = null, restrictions = []) {
        this._item = item;
        this.restrictions = restrictions;   // Slot could only accept/reject certain Items, item types, etc. (e.g. herb bag)
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

    clear() {
        this._item = null;

        return this;
    }
}