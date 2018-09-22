import { Heading } from "./Heading.js";

class Vector extends Heading {
	constructor(x, y, z, yaw, pitch, roll, magnitude, isDegree = true) {
		super(x, y, z, yaw, pitch, roll, isDegree);
		this.Magnitude = magnitude;		// Allows to be unitless
	}

	Get() {
		return {
			...super.Get(),
			Magnitude: this.Magnitude
		};
	};
}

export { Vector };