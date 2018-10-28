class EntityHandler {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	onEntityStateChange(msg) {
		console.log(...arguments);
	}

	onEntityMove(msg, uuid, x, y) {
		let entity = this.FuzzyKnights.Common.Entity.EntityManager.GetEntity(uuid);
		this.FuzzyKnights.Common.Component.Mutator.Maps.SetPosition(entity, x, y);
	}

	onEntityDamage(msg, target, source, damage) {
		// this.FuzzyKnights.Common.Entity.EntityManager
		console.log(arguments);
	}

	ProcessMessage(msg) {
		let payload = Object.values(msg.Payload);
		if(msg.MessageType === "EntityDamageMessage") {
			this.onEntityDamage(msg, ...payload);
		} else if(msg.MessageType === "EntityMoveMessage") {
			this.onEntityMove(msg, ...payload);
		} else if(msg.MessageType === "EntityStateChangeMessage") {
			this.onEntityStateChange(msg, ...payload);
		}
	}
	ReceiveMessage(msg, time = null) {
		this.ProcessMessage(msg);

		if(this.FuzzyKnights.IsServer) {
			console.log(`[MESSAGE RECEIVED - EntityHandler]: ${msg.MessageType}`);
		} else {
			console.log(`[MESSAGE RECEIVED]: ${msg.MessageType}`, msg);
		}
	}
}

export { EntityHandler };