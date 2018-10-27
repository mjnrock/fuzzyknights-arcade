import Components from "../../component/package.js";
import { Terrain } from "./Terrain.js";

class Grass extends Terrain {
	constructor(meta = null) {
		super(
			Components.Enum.TerrainType.GRASS,
			Components.Enum.NavigabilityType.GRASS,
			meta
		);
	}
}

export { Grass };