import { Component } from "./Component.js";
import EnumComponentType from "./../enum/ComponentType.js";

class Name extends Component {
	constructor(nomen, name) {
		super(EnumComponentType.NAME);

		this.Nomen = nomen;
		this.Name = name;
	}
}

export { Name };