class PlayerHandler {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	ProcessMessage(msg) {
		if(msg.MessageType === "PlayerConnectMessage") {
			if(!this.FuzzyKnights.IsServer) {
				console.log(msg);
				// this.FuzzyKnights.Client.Network.ConnectionClient.UUID = 
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

export { PlayerHandler };