import EnumComponentType from "./enum/ComponentType.js";

import { Component } from "./Component.js";
import { State } from "./element/State.js";

class States extends Component {
	/**
	 * @param [[EnumStateType, ...values], ...]
	 */
	constructor(states = []) {
		super(EnumComponentType.STATES);

		for(let i in states) {
			this.Elements[states[i][0]] = new State(...states[i]);
		}
	}
}

export { States };