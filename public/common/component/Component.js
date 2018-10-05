import { NewUUID } from "../utility/Functions.js";

class Component {
	constructor(type) {
		this.Type = type;
		this.UUID = NewUUID();
		
		this.Elements = {};
	}

	Serialize() {
		return JSON.stringify(this);
	}
}

export { Component };