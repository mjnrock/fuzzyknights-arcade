import Item, { EnumItemType } from "../Item";

export default class ItemWoodenShield extends Item {
    constructor({ components, activate, id } = {}) {
        super("wooden-shield", EnumItemType.ARMOR, {
            maxStackSize: 1,
            components,
            activate,
            id,
        });
    }
}