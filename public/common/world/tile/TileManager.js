class TileManager {
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

	GetVoxel(x, y) {
		if(!this.HasMap()) {
			return false;
		}

		return this.Map.GetNode(x, y);
	}

	Tick(time) {
		//TODO TileManager tick commands
	}
}

export { TileManager };