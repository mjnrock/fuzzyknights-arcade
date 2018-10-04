import { NewUUID } from "../utility/Functions.js";

class Component {
	constructor() {
		this.Type = this.constructor.name;
		this.UUID = NewUUID();
	}
}

export { Component };