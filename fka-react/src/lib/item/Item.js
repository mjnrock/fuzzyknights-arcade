import { v4 as uuidv4 } from "uuid";
import { Enumerator } from "./../hive/Helper";

export const EnumItemType = Enumerator({
    WEAPON: 2 << 0,
    ARMOR: 2 << 0,
    CONSUMABLE: 2 << 0,
    REAGENT: 2 << 0,
    MATERIAL: 2 << 0,
});

export default class Item {
    constructor(name, type, { components = [], maxStackSize = 1, activate, id } = {}) {
        this.id = id || uuidv4();

        this.name = name;
        this.type = type;
        this.components = components;
        this.maxStackSize = maxStackSize;

        if(typeof activate === "function") {
            this.activate = activate;
        }
    }

    activate(...args) {}
}