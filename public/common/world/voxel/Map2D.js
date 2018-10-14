import { Map } from "./Map.js";

class Map2D extends Map {
	constructor(xmax, ymax, type) {
		super(xmax, ymax, 1, type);
	}

	GetVoxel(x, y) {
		return super.Get(x, y, 0);
	}
	SetVoxel(x, y, voxel) {
		super.Set(x, y, 0, voxel);

		return this;
	}
}

export { Map2D };