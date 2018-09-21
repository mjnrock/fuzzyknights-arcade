import WebSocketHelper from "./WebSocketHelper.js";
import { NewUUID } from "./../common/utility/Functions.js";

class ConnectionClient {
	constructor(fk, server = "localhost", port = 1337) {
		this.Server = server;
		this.Port = port;
		this.UUID = NewUUID();

		this.WebSocket = new WebSocketHelper(fk, `ws://${this.Server}:${this.Port}/ws`);
		this.FuzzyKnights = fk;
	}
}

export default ConnectionClient;