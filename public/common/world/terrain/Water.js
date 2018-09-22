import EnumTerrainType from "../../enum/TerrainType.js";
import EnumNavigabilityType from "../../enum/NavigabilityType.js";

import { Terrain } from "./Terrain.js";

class Water extends Terrain {
	constructor() {
		super(
			EnumTerrainType.WATER,
			EnumNavigabilityType.WATER
		);
	}
}

export { Water };