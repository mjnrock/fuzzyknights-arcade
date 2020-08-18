export default class Stack {
    constructor({ facing, map = {} } = {}) {
        this.facing = facing;
        this.map = new Map(Object.entries(map));
    }

    get(name) {
        return this.map.get(name);
    }
    set(name, order) {
        this.map.set(name, order);

        return this;
    }

    get order() {
        return this.map.entries().sort(([ ka, va ], [ kb, vb ]) => {
            return va - vb;
        });
    }
};