class EntityManager {
	constructor(entities = {}) {
		this.Entities = entities;

		this.Timestamp = Date.now();
	}

	RegisterEntity(entity) {
		this.Entities[entity.UUID] = entity;

		return this;
	}
	UnregisterEntity(entity) {
		delete this.Entities[entity.UUID];

		return this;
	}

	Tick(time) {
		for(let UUID in this.Entities) {
			this.Entities[UUID].Tick(time);
		}
	}
}

export default new EntityManager();
export { EntityManager };