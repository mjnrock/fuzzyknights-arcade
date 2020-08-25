import { v4 as uuidv4 } from "uuid";
import Slot from "./Slot";

export default class Inventory {
    constructor(size = 1, { keys = {}, contents = [], id } = {}) {
        this.id = id || uuidv4();
        
        this.size = size;
        this.slots = new Map();
        this.keyMap = new Map();

        for(let i = 0; i < this.size; i++) {
            this.slots.set(i, new Slot());
        }

        // TODO
        // for(let [ item, qty ] of contents) {
            // 
        // }

        for(let [ key, index ] of Object.entries(keys)) {
            if(this.isValidIndex(index)) {

            }
            this.keyMap.set(key, index);
        }
    }

    get key() {
        const map = {};

        this.keyMap.forEach((index, key) => {
            map[ key ] = this.slot(index);
        });

        return map;
    }

    slot(index) {
        if(index >= 0 && index < this.size) {
            return this.slots.get(index);
        }
    }

    isValidIndex(index) {
        return this.slots.has(index);
    }

    toSlotArray() {
        return [ ...this.slots.entries() ];
    }
    toItemStackArray() {
        return this.toSlotArray().map(([ i, slot ]) => [ i, slot.itemStack, slot ]);
    }
    toItemArray() {
        return this.toSlotArray().map(([ i, slot ]) => [ i, slot.item, slot ]);
    }
}