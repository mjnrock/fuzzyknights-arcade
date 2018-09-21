import { NewUUID } from "./../utility/Functions.js";

class Message {
	constructor(type, payload) {
		this.MessageType = type;
		this.EventType = payload.EventType;
		this.Payload = payload.Payload;
		this.UUID = NewUUID();
		this.Timestamp = payload.timestamp || Date.now();

		this.IsProcessed = false;
	}

	Send() {
		if(Message.MessageManager !== null) {
			Message.MessageManager.Send(this);

			return true;
		}

		return false;
	}
}

//@param | MessageManager <FuzzyKnights.Common.Message.MessageManager> | Initialize in the Master Coordinator file
Message.MessageManager = null;

export { Message };