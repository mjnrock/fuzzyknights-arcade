import { NewUUID } from "./../utility/Functions.js";

class Message {
	constructor(type, payload, isServerOrigin = false) {
		this.MessageType = type;
		this.EventType = payload.EventType;
		this.Payload = payload.Payload;
		this.UUID = NewUUID();
		this.Timestamp = payload.timestamp || Date.now();

		this.IsServerOrigion = isServerOrigin;
	}
}

export { Message };