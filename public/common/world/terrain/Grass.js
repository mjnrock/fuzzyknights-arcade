import EnumTerrainType from "./../../enum/TerrainType.js";
import EnumNavigabilityType from "./../../enum/NavigabilityType.js";

import { Terrain } from "./Terrain.js";

class Grass extends Terrain {
	constructor() {
		super(
			EnumTerrainType.GRASS,
			EnumNavigabilityType.GRASS
		);
	}
}

export { Grass };