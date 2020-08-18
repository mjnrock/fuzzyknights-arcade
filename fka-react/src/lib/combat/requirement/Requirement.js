import { Enumerator } from "../../hive/Helper";

export const EnumRequirementType = Enumerator({
    RESOURCE: 2 << 0,
});

export default class Requirement {
    constructor({ type, require } = {}) {;
        this.type = type;
        this.require = require;
    }

    judge(entity, ...args) {
        return this.require(entity, ...args);
    }
};