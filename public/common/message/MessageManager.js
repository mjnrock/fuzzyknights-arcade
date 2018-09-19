import EnumMessageType from "./../enum/MessageType.js";

import { Message } from "./Message.js";
import { ChatMessage } from "./ChatMessage.js";

class MessageManager {
	constructor(msgs) {
		this.Messages = msgs || [];
	}

	BuildMessage(type, payload) {
		if(type === EnumMessageType.CHAT) {
			return new ChatMessage(type, payload);
		}

		return this;
	}
	Send(msg) {
		//TODO Add Multiplayer check here to send as Packet, if needed
		this.Enqueue(msg);
	}
	Spawn(type, payload) {
		let msg = this.BuildMessage(type, payload);

		if(msg instanceof Message) {
			this.Send(msg);

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
		console.log("Dispatching Message");

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
		console.log("Ended MessageManager Tick");
	}
}

export default new MessageManager();
export { MessageManager };