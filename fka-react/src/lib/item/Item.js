import { v4 as uuidv4 } from "uuid";
import { Enumerator } from "./../hive/Helper";
import ItemStack from "./ItemStack";

export const EnumItemType = Enumerator({
    WEAPON: 2 << 0,
    ARMOR: 2 << 1,
    CONSUMABLE: 2 << 2,
    REAGENT: 2 << 3,
    MATERIAL: 2 << 4,
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

    toItemStack(qty) {
        return new ItemStack(this, qty);
    }
}