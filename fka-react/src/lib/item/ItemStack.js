// import Item from "./Item";

export default class ItemStack {
    constructor(item = null, qty = 1) {
        this.item = item;
        this.quantity = qty;
    }
}