class InputHandler {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	ProcessMessage(msg) {
		if(msg.MessageType === "InputKeyboardMessage") {
			//NOOP
		} else if(msg.MessageType === "InputPlayerKeyStateMessage") {
			if(!this.FuzzyKnights.IsServer) {
				this.FuzzyKnights.Common.Message.Packet.PacketManager.SpawnServer(msg);
			}
		}
	}
	ReceiveMessage(msg, time = null) {
		this.ProcessMessage(msg);

		if(this.FuzzyKnights.IsServer) {
			console.log(`[RECEIVED MESSAGE]: ${msg.MessageType}`);
		} else {
			console.log(msg);
		}
	}
}

export { InputHandler };