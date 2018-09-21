import { Handler } from "./Handler.js";

import EnumMessageType from "../enum/MessageType.js";
import EnumEventType from "../enum/EventType.js";
import EnumPacketType from "../enum/PacketType.js";
import EnumEntityType from "../enum/EntityType.js";
import EnumComponentType from "../enum/ComponentType.js";

class EntityHandler extends Handler {
	constructor(fk) {
		super(fk);

		this.AddEvent(EnumEventType.ON_ENTITY_CONSTRUCTION, (entity) => this.OnEntityConstruction(entity));
		this.AddEvent(EnumEventType.ON_ENTITY_JOIN_WORLD, (entity) => this.OnEntityJoinWorld(entity));

		this.FuzzyKnights.Common.Entity.Entity.prototype.PostInit = this.GetEvent(EnumEventType.ON_ENTITY_CONSTRUCTION);
	}


	GetEntityClass(entityType) {
		switch(entityType) {
			case EnumEntityType.ENTITY:
				return this.FuzzyKnights.Common.Entity.Entity;
			case EnumEntityType.ENTITY_CAT:
				return this.FuzzyKnights.Common.Entity.EntityCat;
			default:
				return null;
		}
	}
	GetComponentClass(componentType) {
		switch(componentType) {
			case EnumComponentType.NAME:
				return this.FuzzyKnights.Common.Component.Name;
			case EnumComponentType.HEALTH:
				return this.FuzzyKnights.Common.Component.Health;
			default:
				return null;
		}
	}
	CreateEntityFromMessage(msg) {
		let clazz = this.GetEntityClass(msg.Payload.Type);
		let components = msg.Payload.Components.map((v, i) => {
			let comp = this.GetComponentClass(v.Type),
				args = [];

			switch(v.Type) {
				case EnumComponentType.NAME:
					args = [
						v.Nomen,
						v.Name
					];
					break;
				case EnumComponentType.HEALTH:
					args = [
						v.Current,
						v.Max
					];
					break;
				default:
					return null;
			}

			comp = new comp(...args);
			comp.UUID = v.UUID;

			return comp;
		});

		let entity = new clazz(components, msg.Payload.UUID);

		return entity;
	}

	SpawnEventMessage(messageType, eventType, payload) {
		let msg = super.BuildEventMessage(messageType, eventType, payload);

		if(this.FuzzyKnights.IsServer) {
			switch(eventType) {
				case EnumEventType.ON_ENTITY_CONSTRUCTION:
					this.FuzzyKnights.Common.Message.Packet.PacketManager.Spawn(EnumPacketType.BROADCAST, msg);
					break;
				default:
					break;
			}
		}
	}

	//EVENT
	OnEntityConstruction(entity) {
		if(!this.FuzzyKnights.Common.Entity.EntityManager.HasEntity(entity)) {
			this.FuzzyKnights.Common.Entity.EntityManager.RegisterEntity(entity);

			this.SpawnEventMessage(
				EnumMessageType.ENTITY,
				EnumEventType.ON_ENTITY_CONSTRUCTION,
				entity
			);
		}

		return entity;
	}

	//EVENT
	OnEntityJoinWorld(entity) {
		this.SpawnEventMessage(
			EnumMessageType.ENTITY,
			EnumEventType.ON_ENTITY_JOIN_WORLD,
			entity
		);

		return entity;
	}
}

export { EntityHandler };