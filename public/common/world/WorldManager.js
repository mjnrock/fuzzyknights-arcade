import EnumMapType from "./../enum/MapType.js";

class WorldManager {
	constructor(fk) {
		this.FuzzyKnights = fk;
		this.VoxelManager = this.FuzzyKnights.Common.World.Voxel.VoxelManager;
	}

	Tick(time) {
		this.VoxelManager.Tick(time);
	}
}

export { WorldManager };