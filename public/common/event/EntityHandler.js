class EntityHandler {
	constructor() {}

	OnEntityConstruction(manager, entity) {
		manager.RegisterEntity(entity);

		return entity;
	}
}

export default new EntityHandler;