class VoxelManager {
	constructor(fk) {
		this.FuzzyKnights = fk;
		this.Map = null;
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

	Tick(time) {
		//TODO VoxelManager tick commands
	}
}

export { VoxelManager };