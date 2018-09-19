import { Component } from "./Component.js";
import EnumComponentType from "../enum/ComponentType.js";

class Health extends Component {
	constructor(hp, max = null) {
		super(EnumComponentType.HEALTH);

		this.Current = hp;
		this.Max = max !== null ? max : hp;
	}
}

export { Health };