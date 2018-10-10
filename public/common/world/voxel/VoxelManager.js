class VoxelManager {
	constructor(map = null) {
		this.Map = map;
	}

	HasMap() {
		return this.Map !== null && this.Map !== void 0;
	}
	GetMap() {
		return this.Map;
	}
	SetMap(map) {
		this.Map = map;

		return this;
	}

	GetVoxel(x, y, z = 0) {
		if(!this.HasMap()) {
			return false;
		}

		return this.Map.GetVoxel(x, y, z);
	}
}

export { VoxelManager };