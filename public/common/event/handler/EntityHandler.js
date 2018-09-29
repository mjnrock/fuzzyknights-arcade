class EntityHandler {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	ProcessMessage(msg) {
		if(msg.MessageType === "EntityDamageMessage") {
			new this.FuzzyKnights.Common.Event.EntityDamageEvent(msg.Payload.Target, msg.Payload.Source, msg.Payload.Damage);
		}
	}
	ReceiveMessage(msg, time = null) {
		this.ProcessMessage(msg);

		if(this.FuzzyKnights.IsServer) {
			console.log(`[MESSAGE RECEIVED - InputHander]: ${msg.MessageType}`);
		} else {
			console.log(`[MESSAGE RECEIVED]: ${msg.MessageType}`, msg);
		}
	}
}

export { EntityHandler };