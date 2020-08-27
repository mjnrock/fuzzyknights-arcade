import Entity, { EnumEntityType, EnumEventType } from "./Entity";
import Game from "../Game";
import { EnumComponentType } from "./components/Component";
import { EnumState } from "./components/State";
import Models from "./../model/package";

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
                                console.log(comp.bags.isFull)
                                if(!comp.bags.isFull) {
                                    comp.bags.add(this.item, this.quantity);
    
                                    this.isDisabled = true;
                                    this.kill();
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
}; 