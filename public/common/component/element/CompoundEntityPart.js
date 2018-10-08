import { Element } from "./Element.js";

class CompoundEntityPart extends Element {
	/**
	 * @param Entity entity 
	 * @param Position position The relative position of this entity as referenced by the Anchor Entity
	 */
	constructor(entity, position) {
		super(null);	//! Likely will not be used for this Element
		
		this.Entity = entity;
		this.Position = position;
	}

	GetEntity() {
		return this.entity;
	}
	SetEntity(entity) {
		this.Entity = entity;
		
		return this;
	}

	GetPosition() {
		return this.position;
	}
	SetPosition(position) {
		this.Position = position;
		
		return this;
	}
}

export { CompoundEntityPart };