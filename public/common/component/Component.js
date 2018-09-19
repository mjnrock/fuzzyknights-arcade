import { NewUUID } from "../utility/Helper.js";

class Component {
	constructor(type) {
		this.Type = type;
		this.UUID = NewUUID();
	}
}

export { Component };