import EnumMessageType from "./../enum/MessageType.js";
import { Message } from "./Message.js";

class ChatMessage extends Message {
	constructor(message) {
		super(EnumMessageType.CHAT, {
			Message: message
		});
	}
}

export { ChatMessage };