import Item, { EnumItemType } from "./../Item";

export default class ItemWoodenSword extends Item {
    constructor({ components, activate, id } = {}) {
        super("wooden-sword", EnumItemType.WEAPON, {
            maxStackSize: 1,
            components,
            activate,
            id,
        });
    }
}