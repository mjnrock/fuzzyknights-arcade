import EnumMessageType from "./../enum/MessageType.js";
import EnumEventType from "./../enum/EventType.js";

class EntityHandler {
	constructor(mm) {
		this.MessageManager = mm;
	}

	GetMessageManager() {
		return this.MessageManager;
	}
	SetMessageManager(mm) {
		this.MessageManager = mm;

		return this;
	}

	SendEventMessage(messageType, eventType, payload) {
		this.MessageManager.Spawn(messageType, eventType, payload);

		return this;
	}

	OnEntityConstruction(manager, entity) {
		manager.RegisterEntity(entity);

		this.SendEventMessage(
			EnumMessageType.ENTITY,
			EnumEventType.ON_ENTITY_CONSTRUCTION,
			entity
		);

		return entity;
	}

	OnEntityJoinWorld(manager, entity) {

		this.SendEventMessage(
			EnumMessageType.ENTITY,
			EnumEventType.ON_ENTITY_JOIN_WORLD,
			entity
		);

		return entity;
	}
}

export default EntityHandler;