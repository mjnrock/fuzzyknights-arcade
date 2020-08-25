import ItemStack from "./ItemStack";
import Item from "./Item";

//? An Inventory with a specific type should still be enforced at the Slot level, with [].every()-inspired setup
export default class Slot {
    constructor(itemStack = null, restrictions = []) {
        if(itemStack instanceof Item) {
            this.itemStack = new ItemStack(itemStack, 1);
        } else if(itemStack instanceof ItemStack) {
            this.itemStack = itemStack;
        } else {
            this.itemStack = null;
        }

        this.restrictions = restrictions;   // Slot could only accept/reject certain Items, item types, etc. (e.g. herb bag)
    }

    get item() {
        return this.itemStack ? this.itemStack.item : null;
    }
    get isEmpty() {
        return this.itemStack ? this.itemStack.qty === 0 : true;
    }

    clear() {
        this.itemStack = null;

        return this;
    }
}