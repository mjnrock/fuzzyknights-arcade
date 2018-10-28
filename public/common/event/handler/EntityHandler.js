class EntityHandler {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	onEntityMoveMessage(uuid, x, y) {
		// let entity = this.FuzzyKnights.Common.Entity.EntityManager.FindEntity(uuid);
		// this.FuzzyKnights.Common.Component.Mutator.Maps.SetPosition(entity, x, y);
		console.log(JSON.stringify(uuid));
	}

	onEntityDamageMessage(target, source, damage) {
		// this.FuzzyKnights.Common.Entity.EntityManager
		console.log(arguments);
	}

	ProcessMessage(msg) {
		let payload = Object.values(msg.Payload);
		if(msg.MessageType === "EntityDamageMessage") {
			this.onEntityDamageMessage(...payload);
		} else if(msg.MessageType === "EntityMoveMessage") {
			this.onEntityMoveMessage(...payload);
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