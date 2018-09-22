import { Handler } from "./Handler.js";

import EnumMessageType from "../enum/MessageType.js";
import EnumEventType from "../enum/EventType.js";
import EnumPacketType from "../enum/PacketType.js";
import EnumEntityType from "../enum/EntityType.js";
import EnumComponentType from "../enum/ComponentType.js";

class PlayerHandler extends Handler {
	constructor(fk) {
		super(fk);

		this.AddEvent(EnumEventType.PLAYER_CONNECT, (obj) => this.OnPlayerConnect(obj));
		this.AddEvent(EnumEventType.PLAYER_DISCONNECT, (obj) => this.OnPlayerDisconnect(obj));
	}

	SpawnEventMessage(messageType, eventType, payload) {
		let msg = super.BuildEventMessage(messageType, eventType, payload);

		if(this.FuzzyKnights.IsServer) {
			switch(eventType) {
				case EnumEventType.ENTITY_CONSTRUCTION:
					// this.FuzzyKnights.Common.Message.Packet.PacketManager.Spawn(EnumPacketType.BROADCAST, msg);
					break;
				case EnumEventType.PLAYER_DISCONNECT:
					// this.FuzzyKnights.Common.Message.Packet.PacketManager.Spawn(EnumPacketType.BROADCAST, msg);
					break;
				default:
					break;
			}
		}
	}

	//EVENT
	OnPlayerConnect(obj) {
		this.FuzzyKnights.Common.World.WorldManager.AddPlayer(player);

		this.SpawnEventMessage(
			EnumMessageType.ENTITY,
			EnumEventType.ENTITY_CONSTRUCTION,
			entity
		);

		return entity;
	}

	//EVENT
	OnPlayerDisconnect(entity) {
		this.SpawnEventMessage(
			EnumMessageType.ENTITY,
			EnumEventType.ENTITY_JOIN_WORLD,
			entity
		);

		return entity;
	}
}

export { PlayerHandler };