import WebSocketHelper from "./WebSocketHelper.js";

class ConnectionClient {
	constructor(server, port) {
		this.Server = "localhost";
		this.Port = 1337;
		this.UUID = Math.random();	//TODO Make an actual UUID from function

		this.WebSocket = new WebSocketHelper(`ws://${this.Server}:${this.Port}/ws`);
		this.WebSocket.Send({
			Type: "AUTHENTICATE",
			Message: "test"
		});
	}

	Authenticate() {
		fetch(`http://${this.Server}:${this.Port}/api/auth`)
		.then(response => response.json())
		.then(json => console.log(json));
	}
}

export default new ConnectionClient();