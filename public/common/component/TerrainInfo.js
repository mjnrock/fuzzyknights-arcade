import EnumComponentType from "./enum/ComponentType.js";

import { Component } from "./Component.js";

class TerrainInfo extends Component {
	constructor(type, nav, meta) {
		super(EnumComponentType.TERRAIN_INFO);

		Type = type;
		Navigability = nav;
		Meta = meta;
	}
}

export { TerrainInfo };