import EnumComponentType from "./enum/ComponentType.js";

import { Component } from "./Component.js";
import { Map } from "./element/Map.js";

class Maps extends Component {
	/**
	 * @param [[EnumMapType, X, Y, MapUUID], ...] maps : [Modifiers] parameter is optional
	 */
	constructor(maps = []) {
		super(EnumComponentType.MAPS);

		for(let i in maps) {
			this.Elements[maps[i][0]] = new Map(...maps[i]);
		}
	}
}

export { Maps };