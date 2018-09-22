import EnumMessageType from "./../enum/MessageType.js";
import EnumEventType from "./../enum/EventType.js";

import { EventData } from "./../event/EventData.js";

import { Message } from "./Message.js";
import { EntityMessage } from "./EntityMessage.js";

class MessageManager {
	constructor(fk, msgs) {
		this.FuzzyKnights = fk;
		this.Messages = msgs || [];
	}

	Size() {
		return this.Messages.length;
	}
	GetMessages() {
		return this.Messages;
	}
	SetMessages(msgs) {
		this.Messages = msgs;

		return this;
	}

	GetMessageClass(messageType) {
		switch(messageType) {
			case EnumMessageType.ENTITY:
				return EntityMessage;
			default:
				return null;
		}
	}

	BuildMessage(messageType, eventType, payload) {
		let msg = new (this.GetMessageClass(messageType))((new EventData(eventType, payload)).GetEventData());
		msg.Origin = this.FuzzyKnights.IsServer;

		return msg;
	}
	Spawn(messageType, eventType, payload) {
		return this.Receive(this.BuildMessage(messageType, eventType, payload));
	}

	Receive(msg) {
		if(msg instanceof Message) {
			this.Enqueue(msg);

			return msg;
		}

		return false;
	}

	Enqueue(msg) {
		this.Messages.push(msg);

		return this;
	}
	Dequeue() {
		if(this.Messages.length > 0) {
			return this.Messages.splice(0, 1)[0];
		}

		return false;
	}
	
	Dispatch(msg, time = null) {
		if(msg.MessageType === EnumMessageType.ENTITY) {
			if(msg.EventType === EnumEventType.ENTITY_CONSTRUCTION) {
				this.FuzzyKnights.Common.Entity.EntityManager.ReceiveMessage(msg, time);
			}

			return true;
		}

		return false;
	}

	Tick(time) {
		let start = Date.now(),
			timeout = 2000;

		while(this.Messages.length > 0 || (Date.now() - start >= timeout)) {
			this.Dispatch(this.Dequeue(), time);
		}
	}
}

export default MessageManager;