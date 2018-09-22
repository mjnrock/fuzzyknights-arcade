import EnumTerrainType from "../../enum/TerrainType.js";
import EnumNavigabilityType from "../../enum/NavigabilityType.js";

import { Terrain } from "./Terrain.js";

class Dirt extends Terrain {
	constructor() {
		super(
			EnumTerrainType.DIRT,
			EnumNavigabilityType.DIRT
		);
	}
}

export { Dirt };