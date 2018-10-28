class PlayerHandler {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	ProcessMessage(msg) {
		if(msg.MessageType === "PlayerConnectMessage") {
			if(!this.FuzzyKnights.IsServer) {
				this.FuzzyKnights.Client.Network.ConnectionClient.UUID = msg.Payload.UUID;
				this.FuzzyKnights.Client.Network.ConnectionClient.WebSocket.UUID = msg.Payload.UUID;
			}
		}
	}
	ReceiveMessage(msg, time = null) {
		this.ProcessMessage(msg);

		if(this.FuzzyKnights.IsServer) {
			console.log(`[MESSAGE RECEIVED - PlayerHandler]: ${msg.MessageType}`);
		} else {
			console.log(`[MESSAGE RECEIVED]: ${msg.MessageType}`, msg);
		}
	}
}

export { PlayerHandler };