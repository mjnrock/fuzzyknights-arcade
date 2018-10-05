import EnumComponentType from "../enum/ComponentType.js";
import EnumAttributeType from "../enum/AttributeType.js";

import { Mutator } from "./Mutator.js";

class Attributes extends Mutator {
	constructor(fk) {
		super(fk);
	}

	GetComponent(entity) {
		//? Decorator cleanup for expirations
		let comp = super.GetComponent(entity, EnumComponentType.ATTRIBUTES);
		comp.RemoveExpiredModifiers();

		return comp;
	}
	
	GetMight(entity) {
		return this.GetComponent(entity).Singletons[EnumAttributeType.MIGHT];
	}
	GetToughness(entity) {
		return this.GetComponent(entity).Singletons[EnumAttributeType.TOUGHNESS];
	}
}

export { Attributes };