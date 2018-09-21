import EnumEntityType from "./../enum/EntityType.js";
import Component from "./../component/package.js";

import { Entity } from "./Entity.js";

class EntityCat extends Entity {
	constructor(components) {
		super(EnumEntityType.ENTITY_CAT);
		this.Components = components || [
			new Component.Name("entity-cat", "Mr. Kittums"),
			new Component.Health(10)
		];
	}

	// Tick(time) {
	// 	super.Tick(time);
	// }
}

export { EntityCat };