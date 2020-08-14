import ItemStack from "./ItemStack";
import Item from "./Item";

export default class Slot {
    constructor(item = null) {
        this.item = item;
    }
}