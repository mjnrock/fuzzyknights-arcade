class TileManager {
	constructor(fk) {
		this.FuzzyKnights = fk;

		//TODO Maintain a list of Maps that have active Player entities
		//TODO If on Client side, only maintain Player's active map
		this.Maps = [];
	}

	HasMap() {
		return this.Maps.length > 0;
	}
	GetMaps() {
		return this.Maps;
	}
	SetMaps(maps) {
		this.Maps = maps;

		return this;
	}

	Tick(time) {
		//TODO TileManager tick commands
	}
}

export { TileManager };