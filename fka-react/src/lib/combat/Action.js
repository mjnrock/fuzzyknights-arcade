import { Enumerator } from "./../hive/Helper";

export const EnumActionType = Enumerator({
    ABILITY: 2 << 0,
    INTERACT: 2 << 1,
});

export default class Action {
    constructor({ type } = {}) {
        this.type = type;
    }
    
    execute(...args) {
        const entity = this;

        if(this.type === EnumActionType.ABILITY) {

        } else if(this.type === EnumActionType.INTERACT) {

        }
    }
};