import EnumComponentType from "./enum/ComponentType.js";

import { Component } from "./Component.js";

class RigidBody extends Component {
	constructor() {
		super(EnumComponentType.RIGID_BODY);

		this.Mass = ;
		this.Speed = ;
		this.Location = ;
		this.Model = ;
	}
}

export { RigidBody };