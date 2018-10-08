import EnumComponentType from "./enum/ComponentType.js";

import { Component } from "./Component.js";

//?	This component approach allows for the Mutators to change physics and calculations on constituent Entities, to create multi-entity constructions (e.g. house, big tree, etc.)
class CompoundEntity extends Component {
	/**
	 * @param Entity anchor The "main" entity, to which, all relative positions are anchored (i.e. the Entity @ XYZ:0,0,0)
	 * @param ??? constituents A list of constituents to comprise the multi-entity construction
	 */
	constructor(anchor, ...constituents) {
		super(EnumComponentType.COMPOUND_ENTITY);

		this.Anchor = anchor;
		for(let i in constituents) {
			//TODO Come up with a parameter type for "constituents" and map accordingly here
		}
	}
}

export { CompoundEntity };