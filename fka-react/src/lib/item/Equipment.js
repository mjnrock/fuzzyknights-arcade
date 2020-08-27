import Inventory from "./Inventory";

export default class Equipment extends Inventory {
    constructor({ head, left, right } = {}) {
        super(3, {
            keys: {
                head: 0,
                left: 1,
                right: 2,
            }
        });

        this.head.set(...(Array.isArray(head) ? head : [ head ]));      // ItemStack || [ Item, Quantity ]
        this.left.set(...(Array.isArray(left) ? left : [ left ]));      // ItemStack || [ Item, Quantity ]
        this.right.set(...(Array.isArray(right) ? right : [ right ]));  // ItemStack || [ Item, Quantity ]
    }

    get head() {
        return this.key.head;
    }
    get left() {
        return this.key.left;
    }
    get right() {
        return this.key.right;
    }

    //TODO
    get(name) {
        return this.key[ name ];
    }
    set(name, item) {
        this.slots.set(name, item);

        return this;
    }
    swap(name0, name1) {
        const zero = this.get(name0);

        this.set(name0, this.get(name1));
        this.set(name1, zero);

        return this;
    }
    remove(name) {
        this.slots.delete(name);
    }
}