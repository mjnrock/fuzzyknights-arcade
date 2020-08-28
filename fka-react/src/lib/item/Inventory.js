import { v4 as uuidv4 } from "uuid";
import Slot from "./Slot";

export default class Inventory {
    constructor(size = 1, { keys = {}, contents = [], id } = {}) {
        this.id = id || uuidv4();
        
        this.size = size;
        this.slots = new Map();
        this.keyMap = new Map();

        for(let i = 0; i < this.size; i++) {
            this.slots.set(i, new Slot({ parent: this }));
        }

        // TODO
        // for(let [ item, qty ] of contents) {
            // 
        // }

        for(let [ key, index ] of Object.entries(keys)) {
            if(this.isValidIndex(index)) {
                this.keyMap.set(key, index);
            }
        }
    }

    get isFull() {
        return [ ...this.slots.values() ].every(slot => !slot.isEmpty);
    }

    get key() {
        const map = {};

        this.keyMap.forEach((index, key) => {
            map[ key ] = this.slot(index);
        });

        // console.log(this.slots);
        // console.log(this.keyMap);
        // console.log(map);

        return map;
    }

    add(itemOrItemStack, qty) {
        for(let slot of [ ...this.slots.values() ]) {
            if(slot.isEmpty) {
                slot.set(itemOrItemStack, qty);

                return true;
            }
        }

        return false;
    }
    /**
     * ! This is NOT override-safe
     */
    set(index, itemOrItemStack, qty) {
        const slot = this.slot(index);

        if(slot) {
            slot.set(itemOrItemStack, qty);

            return true;
        }

        return false;
    }

    slot(index) {
        if(this.isValidIndex(index)) {
            return this.slots.get(index);
        }
    }

    getKeyFromIndex(index) {
        for(let [ key, i ] of [ ...this.keyMap.entries() ]) {
            if(index === i) {
                return key;
            }
        }
    }

    isValidIndex(index) {
        return this.slots.has(index);
    }

    toSlotArray(useKeys = false) {
        if(useKeys === true) {
            if(this.keyMap.size === this.slots.size) {  // Bijection optimization (avoids .getKeyFromIndex loop)
                return [ ...this.keyMap.entries() ].map(([ key, index ]) => {    
                    return [ key, this.slot(index) ];
                });
            }

            return [ ...this.slots.entries() ].map(([ index, slot ]) => {   // If this executes, then not all Slots are key-mapped
                const key = this.getKeyFromIndex(index);

                return [ key, slot ];
            });
        }

        return [ ...this.slots.entries() ];
    }
    toItemStackArray() {
        return this.toSlotArray().map(([ i, slot ]) => [ i, slot.itemStack, slot ]);
    }
    toItemArray() {
        return this.toSlotArray().map(([ i, slot ]) => [ i, slot.item, slot ]);
    }
}