import EnumMessageType from "./../enum/MessageType.js";

import { EventData } from "./../event/EventData.js";

import { Message } from "./Message.js";
import { EntityMessage } from "./EntityMessage.js";

class MessageManager {
	constructor(fk, msgs) {
		this.FuzzyKnights = fk;
		this.Messages = msgs || [];
	}

	GetMessageClass(messageType) {
		switch(messageType) {
			case EnumMessageType.ENTITY:
				return EntityMessage;
				break;
			default:
				return null;
				break;
		}
	}
	Spawn(messageType, eventType, payload) {
		let msg = new (this.GetMessageClass(messageType))((new EventData(eventType, payload)).GetEventData());

		if(msg instanceof Message) {
			this.Enqueue(msg);

			return true;
		}

		return false;
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

	Enqueue(msg) {
		console.log(this.FuzzyKnights.IsServer);
		if(this.FuzzyKnights.IsServer) {
			console.log("This is the server");
		}
		this.Messages.push(msg);

		return this;
	}
	Dequeue() {
		if(this.Messages.length > 0) {
			return this.Messages.splice(0, 1);
		}

		return false;
	}
	
	Dispatch(msg, time = null) {
		//DEBUG
		console.log(msg);

		if(msg.Type === EnumMessageType.CHAT) {
			//	Send to CHAT system

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