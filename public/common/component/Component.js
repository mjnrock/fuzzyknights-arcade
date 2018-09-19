import { NewUUID } from "../utility/Functions.js";

class Component {
	constructor(type) {
		this.Type = type;
		this.UUID = NewUUID();
	}
}

export { Component };