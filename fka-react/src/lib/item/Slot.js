import { v4 as uuidv4 } from "uuid";
import ItemStack from "./ItemStack";
import Item from "./Item";

//? An Inventory with a specific type should still be enforced at the Slot level, with [].every()-inspired setup
export default class Slot {
    constructor(itemStack = null, { restrictions = [], id } = {}) {
        this.id = id || uuidv4();

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

    set(itemOrItemStack, qty = 1) {
        if(itemOrItemStack instanceof Item) {
            this.itemStack = new ItemStack(itemOrItemStack, qty);
        } else if(itemOrItemStack instanceof ItemStack) {
            this.itemStack = itemOrItemStack;
        }
    }

    clear() {
        this.itemStack = null;

        return this;
    }

    swap(slot) {
        return Slot.Swap(this, slot);
    }

    static Swap(sa, sb) {
        if(sa instanceof Slot && sb instanceof Slot) {
            const ais = sa.itemStack;

            sa.itemStack = sb.itemStack;
            sb.itemStack = ais;

            return true;
        }

        return false;
    }
}