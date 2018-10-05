import EnumComponentType from "./enum/ComponentType.js";

import { Component } from "./Component.js";
import { Attribute } from "./element/Attribute.js";

class Attributes extends Component {
	/**
	 * @param [[EnumAttributeType, Value, ?[Modifiers]], ...] attributes : [Modifiers] parameter is optional
	 */
	constructor(attributes = []) {
		super(EnumComponentType.ATTRIBUTES);

		for(let i in attributes) {
			this.Elements[attributes[i][0]] = new Attribute(...attributes[i]);
		}
	}
	
	RemoveExpiredModifiers() {
		for(let i in this.Elements) {
			this.Elements[i].RemoveExpiredModifiers();
		}
	}
}

export { Attributes };