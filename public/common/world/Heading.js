import { Coordinate } from "./Coordinate.js";
import { Facing } from "./Facing.js";

class Heading {
	constructor(x, y, z, yaw, pitch, roll, isDegree = true) {
		this.Coordinate = new Coordinate(x, y, z);
		this.Facing = new Facing(yaw, pitch, roll, isDegree);
	}

	Get() {
		return {
			...this.Coordinate,
			...this.Facing
		}
	};
}

export { Heading };