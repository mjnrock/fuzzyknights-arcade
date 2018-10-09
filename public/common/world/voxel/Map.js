import { Grid } from "./../../utility/Grid.js";
import { Voxel } from "./Voxel.js";

class Map {
	/**
	 * @param int w | Grid width
	 * @param int h | Grid height
	 */
	constructor(width, height) {
		this.Grid = new Grid(width, height, Voxel);
	}
}

export { Map };