import EnumComponentType from "../enum/ComponentType.js";
import EnumMapType from "../enum/MapType.js";

import { Mutator } from "./Mutator.js";

class Maps extends Mutator {
	constructor(fk) {
		super(fk);
	}

	GetComponent(entity) {
		let comp = super.GetComponent(entity, EnumComponentType.MAPS);

		return comp;
	}
	
	GetTileMaps(entity) {
		return this.GetComponent(entity).Elements[EnumMapType.TILE];
	}
	GetTerrainMaps(entity) {
		return this.GetComponent(entity).Elements[EnumMapType.TERRAIN];
	}
	GetBiomeMaps(entity) {
		return this.GetComponent(entity).Elements[EnumMapType.BIOME];
	}
}

export { Maps };