class EntityHandler {
	constructor() {}

	OnEntityConstruction(manager, entity) {
		manager.RegisterEntity(entity);
		console.log("Entity Constructed");

		return entity;
	}
}

export default new EntityHandler;