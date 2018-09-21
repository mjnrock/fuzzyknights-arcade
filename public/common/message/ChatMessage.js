import EnumMessageType from "./../enum/MessageType.js";
import { Message } from "./Message.js";

class ChatMessage extends Message {
	constructor(payload) {
		super(EnumMessageType.CHAT, payload);
	}
}

export { ChatMessage };