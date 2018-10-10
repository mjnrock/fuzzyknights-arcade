import { GridXYZ } from "../../utility/GridXYZ.js";
import { Voxel } from "./Voxel.js";

class Map {
	constructor(xmax, ymax, zmax) {
		this.GridXYZ = new GridXYZ(xmax, ymax, zmax, Voxel);
	}

	GetVoxel(x, y, z) {
		return this.GridXYZ.Get(x, y, z);
	}
	SetVoxel(x, y, z, voxel) {
		this.GridXYZ.Set(x, y, z, voxel);

		return this;
	}
}

export { Map };