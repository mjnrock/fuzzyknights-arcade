import { Entity } from "./Entity.js";

import Component from "./../component/package.js";

class EntityCat extends Entity {
	constructor() {
		super();
		this.Components = [
			new Component.Name("entity-cat", "Mr. Kittums"),
			new Component.Health(10)
		];
	}

	// Tick(time) {
	// 	super.Tick(time);
	// }
}

export { EntityCat };