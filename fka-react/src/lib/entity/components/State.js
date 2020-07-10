import Component, { EnumComponentType } from "./Component";

export const EnumState = {
    IDLE: "IDLE",
    WALKING: "WALKING",
    ATTACKING: "ATTACKING",
    DEFENDING: "DEFENDING",
    CASTING: "CASTING",
    DYING: "DYING",
    DEAD: "DEAD",
};

export const EnumCondition = {
    NORMAL: "NORMAL",
    WEAK: "WEAK",
};

export default class State extends Component {
    constructor({ state, condition } = {}) {
        super(EnumComponentType.STATE, {
            state,
            condition,
        });
    }
};