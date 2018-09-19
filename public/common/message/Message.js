import { NewUUID } from "./../utility/Functions.js";

class Message {
	constructor(type, payload) {
		this.Type = type;
		this.Payload = payload;
		this.UUID = NewUUID();
		this.Timestamp = Date.now();

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