import EnumComponentType from "./enum/ComponentType.js";

import { Component } from "./Component.js";
import { Resource } from "./element/Resource.js";

class Resources extends Component {
	/**
	 * @param [[EnumResourceType, Current, Max], ...] resources 
	 */
	constructor(resources = []) {
		super(EnumComponentType.RESOURCES);

		for(let i in resources) {
			this.Elements[resources[i][0]] = new Resource(...resources[i]);
		}
	}
}

export { Resources };