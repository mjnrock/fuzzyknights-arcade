import Common from "./package.js";

class FuzzyKnightsCommon {
	constructor(fk = {}) {
		this.FuzzyKnights = {
			...fk,
			Common
		};

		this.Initialize();
	}

	Initialize() {		
		//@ MessageManager
		this.FuzzyKnights.Common.Message.MessageManager = new this.FuzzyKnights.Common.Message.MessageManager(this.FuzzyKnights);
		this.FuzzyKnights.Common.Game.GameLoop.AddManager(this.FuzzyKnights.Common.Message.MessageManager);
		//@ EntityManager
		this.FuzzyKnights.Common.Entity.EntityManager = new this.FuzzyKnights.Common.Entity.EntityManager(this.FuzzyKnights);
		this.FuzzyKnights.Common.Game.GameLoop.AddManager(this.FuzzyKnights.Common.Entity.EntityManager);
		//@ PacketManager
		this.FuzzyKnights.Common.Message.Packet.PacketManager = new this.FuzzyKnights.Common.Message.Packet.PacketManager(this.FuzzyKnights);
		this.FuzzyKnights.Common.Game.GameLoop.AddManager(this.FuzzyKnights.Common.Message.Packet.PacketManager);


		//@ EntityHandler
		this.FuzzyKnights.Common.Handler.EntityHandler = new this.FuzzyKnights.Common.Handler.EntityHandler(this.FuzzyKnights);

		this.FuzzyKnights.Common.Game.GameLoop.Run();

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

export default FuzzyKnightsCommon;