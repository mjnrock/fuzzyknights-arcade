import Requirement, { EnumRequirementType } from "./Requirement";
import { EnumComponentType } from "../../entity/components/Component";
import { EnumResourceType } from "./../../entity/components/Life";

export default class RequirementResource extends Requirement {
    constructor(mask, amount) {
        super({
            type: EnumRequirementType.RESOURCE,
            require: function(entity) {
                const life = entity.getComponent(EnumComponentType.LIFE);

                if(life) {
                    const arr = [];
                    for(let key of EnumResourceType.maskToNames(mask)) {
                        const type = life[ key ];

                        arr.push(type.subtract(amount, true));
                    }

                    return arr.every(a => a);
                }

                return false;
            },
        });
    }
}