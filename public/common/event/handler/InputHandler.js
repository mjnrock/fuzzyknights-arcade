class InputHandler {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	onInputPlayerKeyStateMessage() {
		console.log(...arguments);
	}

	onInputPlayerKeyStateMessage(uuid, state) {
		if(!this.FuzzyKnights.IsServer) {
			this.FuzzyKnights.Common.Message.Packet.PacketManager.SpawnServer(msg);
		} else {
			//TODO Save the state to a Component on the Entity
			//TODO Build DataWatcher that invokes actions based on State Change (e.g. Map Position)
			// this.FuzzyKnights.Common.
		}
	}

	ProcessMessage(msg) {
		let payload = Object.values(msg.Payload);
		if(msg.MessageType === "InputPlayerKeyStateMessage") {
			this.onInputPlayerKeyStateMessage(...payload);
		} else if(msg.MessageType === "InputKeyboardMessage") {
			this.onInputKeyboardMessage(...payload);
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

export { InputHandler };