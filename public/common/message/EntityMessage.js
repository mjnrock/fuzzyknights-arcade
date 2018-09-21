import EnumMessageType from "../enum/MessageType.js";
import { Message } from "./Message.js";

class EntityMessage extends Message {
	constructor(payload) {
		super(EnumMessageType.ENTITY, payload, true);
	}
}

export { EntityMessage };