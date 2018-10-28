class PlayerHandler {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	onPlayerConnectMessage(msg) {
		if(!this.FuzzyKnights.IsServer) {
			this.FuzzyKnights.Client.Network.ConnectionClient.UUID = msg.Payload.UUID;
			this.FuzzyKnights.Client.Network.ConnectionClient.WebSocket.UUID = msg.Payload.UUID;
		}
	}

	ProcessMessage(msg) {
		let payload = Object.values(msg.Payload);
		if(msg.MessageType === "PlayerConnectMessage") {
			this.onPlayerConnectMessage(msg, ...payload);
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