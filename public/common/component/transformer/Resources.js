import EnumComponentType from "./../enum/ComponentType.js";
import EnumResourceType from "./../enum/ResourceType.js";

import { Transformer } from "./Transformer.js";

class Resources extends Transformer {
	constructor(fk) {
		super(fk);
	}

	GetComponent(entity) {
		return super.GetComponent(entity, EnumComponentType.RESOURCES);
	}
	
	GetHealth(entity) {
		return this.GetComponent(entity).Singletons[EnumResourceType.HEALTH];
	}
	GetMana(entity) {
		return this.GetComponent(entity).Singletons[EnumResourceType.MANA];
	}
}

export { Resources };