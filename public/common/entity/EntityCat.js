import EnumEntityType from "./../enum/EntityType.js";
import Component from "./../component/package.js";

import { Entity } from "./Entity.js";

class EntityCat extends Entity {
	constructor(components, uuid = null) {
		super(uuid, EnumEntityType.ENTITY_CAT);
		this.Components = components || [
			new Component.Name("entity-cat", "Mr. Kittums"),
			new Component.Health(10)
		];
	}

	// Tick(time) {
	// 	super.Tick(time, (time) => {
	// 		console.log(1);
	// 		//	Whatever to do in this tick
	// 	});
	// }
}

export { EntityCat };