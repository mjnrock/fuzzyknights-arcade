class InputHandler {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	onInputKeyboardMessage(msg) {
		console.log(...arguments);
	}

	onInputPlayerKeyStateMessage(msg, state) {
		if(!this.FuzzyKnights.IsServer) {
			this.FuzzyKnights.Common.Message.Packet.PacketManager.SpawnServer(msg);
		} else {
			//TODO Lookup msg.Sender (which should be player UUID here), grab Player's Entity UUID and pass below
			//	msg.Sender
			this.FuzzyKnights.Common.Event.Spawn.EntityStateChangeEvent()
		}
	}

	ProcessMessage(msg) {
		let payload = Object.values(msg.Payload);
		if(msg.MessageType === "InputPlayerKeyStateMessage") {
			this.onInputPlayerKeyStateMessage(msg, ...payload);
		} else if(msg.MessageType === "InputKeyboardMessage") {
			this.onInputKeyboardMessage(msg, ...payload);
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