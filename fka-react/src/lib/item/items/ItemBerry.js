import Item, { EnumItemType } from "../Item";

export default class ItemBerry extends Item {
    constructor({ components, activate, id } = {}) {
        super("berry", EnumItemType.CONSUMABLE, {
            maxStackSize: 32,
            components,
            activate,
            id,
        });
    }
}