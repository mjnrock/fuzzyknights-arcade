import Client from "./package.js";

class FuzzyKnightsClient {
	constructor(fk, window) {
		this.FuzzyKnights = {
			Common: fk.Common,
			Client: Client,
			IsServer: false
		};
		this.Window = window;

		return this.FuzzyKnights;
	}
}

export default FuzzyKnightsClient;