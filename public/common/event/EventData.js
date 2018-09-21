class EventData {
	constructor(eventType, payload) {
		this.EventType = eventType;
		this.Payload = payload;
		this.Timestamp = Date.now();
	}

	GetEventData() {
		return {
			EventType: this.EventType,
			Payload: this.Payload,
			Timestamp: this.Timestamp
		};
	}
}

export { EventData };