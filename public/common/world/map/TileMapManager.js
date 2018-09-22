import EntityManager from "./../../entity/EntityManager.js";

class TileMapManager {
	constructor(fk) {
		this.FuzzyKnights = fk;

		//TODO Creation Registration/Unregistration events for creating a new EntityManager
		this.EntityManager = new EntityManager(fk);
	}

	//TODO Hook this into the GameLoop, maybe through WorldManager?
	Tick(time) {
		this.EntityManager.Tick(time);
	}
}

export { TileMapManager };