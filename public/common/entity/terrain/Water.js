import Components from "../../component/package.js";
import { Terrain } from "./Terrain.js";

class Water extends Terrain {
	constructor(meta = null) {
		super(
			Components.Enum.TerrainType.WATER,
			Components.Enum.NavigabilityType.WATER,
			meta
		);
	}
}

export { Water };