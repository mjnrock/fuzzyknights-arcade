class Event {
	constructor(messageType, eventType, payload = {}) {
		this.PreInit(this, arguments);

		this.MessageType = messageType;
		this.EventType = eventType;
		this.Payload = payload;

		this.Timestamp = Date.now();
	}

	PreInit(){}
	PostInit(){}
}

export { Event };