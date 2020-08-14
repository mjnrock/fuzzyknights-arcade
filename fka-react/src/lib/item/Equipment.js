import Inventory from "./Inventory";
import Slot from "./Slot";

export default class Equipment extends Inventory {
    constructor({ head, left, right } = {}) {
        super(3, {
            content: [
                [ "head", new Slot(head) ],
                [ "left", new Slot(left) ],
                [ "right", new Slot(right) ],
            ]
        });
    }

    get head() {
        return this.content.get("head");
    }
    get left() {
        return this.content.get("left");
    }
    get right() {
        return this.content.get("right");
    }

    get(name) {
        return this.content.get(name);
    }
    set(name, item) {
        this.content.set(name, item);

        return this;
    }
    swap(name0, name1) {
        const zero = this.get(name0);

        this.set(name0, this.get(name1));
        this.set(name1, zero);

        return this;
    }
    remove(name) {
        this.content.delete(name);
    }
}