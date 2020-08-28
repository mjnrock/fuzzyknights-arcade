
import ItemStack from "../ItemStack";

import ItemBerry from "./ItemBerry";
import ItemWoodenSword from "./ItemWoodenSword";
import ItemWoodenShield from "./ItemWoodenShield";

const Items = {
    Berry: ItemBerry,
    WoodenSword: ItemWoodenSword,
    WoodenShield: ItemWoodenShield,
};

export default Items;

//* Create an ItemStack of any Item in Items, used as ItemStacks[ key ](qty, ...args) -- [e.g. ItemStacks.WoodenSword(1, ...args) ]
// This does not support setting the ItemStack @id during instantiation
export const ItemStacks = Object.fromEntries(Object.entries(Items).map(([ key, item ]) => {
    return [ key, (qty, ...args) => new ItemStack(new item(...args), qty) ];
}));