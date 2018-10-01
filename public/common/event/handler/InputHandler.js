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
			} else {
				console.log(msg);
			}
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