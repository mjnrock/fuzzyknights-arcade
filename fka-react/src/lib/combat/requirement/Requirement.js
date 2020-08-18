import { Enumerator } from "../../hive/Helper";

export const EnumRequirementType = Enumerator({
    RESOURCE: 2 << 0,
});

export default class Requirement {
    constructor({ type, require } = {}) {;
        this.type = type;
        this.require = require;
    }

    /**
     * Each Requirement should return true|false from its .require property--which is invoked here--return whether or not the requirement has been met
     * @param {Entity} entity 
     * @param  {...any} args 
     */
    judge(entity, ...args) {
        return this.require(entity, ...args);
    }
};