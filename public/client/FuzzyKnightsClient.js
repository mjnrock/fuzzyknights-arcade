import FuzzyKnightsCommon from "../common/FuzzyKnightsCommon.js";
import Client from "./package.js";

class FuzzyKnightsClient {
	constructor(window) {
		this.Window = window;

		this.FuzzyKnightsCommon = new FuzzyKnightsCommon({
			Client: Client,
			IsServer: false
		});
		this.FuzzyKnights = this.FuzzyKnightsCommon.GetFuzzyKnights();

		this.Initialize();
	}

	Initialize() {
		this.FuzzyKnights.Client.ConnectionClient = new this.FuzzyKnights.Client.ConnectionClient(this.FuzzyKnights);

		return this;
	}

	GetFuzzyKnights() {
		return this.FuzzyKnights;
	}
	SetFuzzyKnights(fk) {
		this.FuzzyKnights = fk;

		return this;
	}
}

export default FuzzyKnightsClient;