import Entity, { EnumEntityType, EnumEventType } from "./Entity";
import Game from "../Game";
import { EnumComponentType } from "./components/Component";
import { EnumState } from "./components/State";
import Models from "./../model/package";
import { Bitwise } from "../hive/Helper";
import { EnumItemType } from "../item/Item";

export default class EntityItem extends Entity {
    constructor(item, qty, { comps = [], id, data = {}, lifespan = -1, parent, x, y } = {}) {
        super({
            id,
            x, y,
            lifespan,
            parent,
            type: EnumEntityType.ITEM,
            comps: [
                ...comps
            ],
            data: {
                [ EnumComponentType.RIGID_BODY ]: {
                    model: new Models.Circle(24),
                },

                ...data,
            },

            hooks: {
                [ EnumEventType.COLLISION ]: (target) => {
                    if(target === Game.$.player) {
                        //  FIXME   This collision function is getting called multiple times, resulting in the item being acquired multiple time; "this.isDisabled" is a STUB fix
                        if(this.isDisabled === false) {
                            target.comp(EnumComponentType.STORAGE, (comp) => {
                                if(Bitwise.has(this.item.type, EnumItemType.WEAPON) && comp.equipment.right.isEmpty) {
                                    this.addItemToSlot(comp.equipment.right);
                                } else if(Bitwise.has(this.item.type, EnumItemType.ARMOR) && comp.equipment.left.isEmpty) {
                                    this.addItemToSlot(comp.equipment.left);
                                } else {
                                    if(!comp.bags.isFull) {
                                        this.addItemToInventory(comp.bags);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });

        const state = this.getComponent(EnumComponentType.STATE);
        state.set(EnumState.IDLE, Infinity);

        this.item = item;
        this.quantity = qty;
        this.isDisabled = false;
    }

    addItemToSlot(slot) {
        slot.set(this.item, this.quantity);

        this.isDisabled = true;
        this.kill();
    }
    addItemToInventory(inv) {
        inv.add(this.item, this.quantity);

        this.isDisabled = true;
        this.kill();
    }

    static FromItem(item, qty, pos, opts = {}) {
        return new EntityItem(item, qty, {
            x: pos[ 0 ],
            y: pos[ 1 ],
            opts
        });
    }
    static FromItemStack(itemStack, pos, opts = {}) {
        return new EntityItem(itemStack.item, itemStack.qty, {
            x: pos[ 0 ],
            y: pos[ 1 ],
            opts
        });
    }
}; 