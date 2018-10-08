import EnumComponentType from "./enum/ComponentType.js";

import { Component } from "./Component.js";

class CompoundEntity extends Component {
	/**
	 * @param Entity anchor The "main" entity, to which, all relative positions are anchored (i.e. the Entity @ XYZ:0,0,0)
	 * @param ??? parts A list of parts to comprise the multi-entity construction
	 */
	constructor(anchor, ...parts) {
		super(EnumComponentType.COMPOUND_ENTITY);

		this.Anchor = anchor;
		for(let i in parts) {
			//TODO Come up with a parameter type for "parts" and map accordingly here
		}
	}
}

export { CompoundEntity };