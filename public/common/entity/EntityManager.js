import EnumEventType from "./../enum/EventType.js";

class EntityManager {
	constructor(fk, entities = {}) {
		this.FuzzyKnights = fk;
		this.Entities = entities;

		this.Timestamp = Date.now();
	}

	ReceiveMessage(msg, time) {
		if(this.FuzzyKnights.IsServer) {

		} else {
			if(msg.EventType === EnumEventType.ON_ENTITY_CONSTRUCTION) {
				this.FuzzyKnights.Common.Handler.EntityHandler.CreateEntityFromMessage(msg);
			}
		}
	}

	HasEntity(entity) {
		return !!this.Entities[entity.UUID];
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

export default EntityManager;