class WebSocketHelper {
	constructor(fk, url = `ws://localhost:1337/ws`) {
		this.FuzzyKnights = fk;
		this.ws = new WebSocket(url);
		this.ws.onopen = (e) => this.OnOpen(e);
		this.ws.onmessage = (e) => this.OnMessage(e);
		this.ws.onclose = (e) => this.OnClose(e);
	}

	GetWebSocket() {
		return this.ws;
	}

	ConnectionWrapper(socket, callback) {
		let timeout = 250;

		setTimeout(() => {
			if(socket.readyState === 1) {
				if(typeof callback === "function") {
					callback();
				}
			} else {
				this.ConnectionWrapper(socket, callback);
			}
		}, timeout);
	}

	Send(message) {
		// console.log("Sending message to the server...");
		try {
			this.ConnectionWrapper(this.ws, () =>
				this.ws.send(
					JSON.stringify(message)
				)
			);

			return true;
		} catch (e) {
			return false;
		}
	}

	OnOpen(e) {
		console.log("[Opened] WebSocket Connection");
		// this.ws.send("Hey!");
	}

	OnMessage(e) {
		if(e.isTrusted) {
			if(true) {
				//	Something that PacketManager is loaded and normal situation should occur
			} else {
				//	Something else that considers that the PacketManager might be loaded, but still the first interaction with Server (e.g. PlayerConnectMessage)
			}
			this.FuzzyKnights.Common.Message.Packet.PacketManager.ExtractMessage(e.data);
		}
	}

	OnClose(e) {
		// console.log(e);
	}
}

export default WebSocketHelper;