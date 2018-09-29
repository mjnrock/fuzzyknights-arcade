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
		this.FuzzyKnights.Common.Message.Message.FuzzyKnights = this.FuzzyKnights;
		//@ EntityManager
		this.FuzzyKnights.Common.Entity.EntityManager = new this.FuzzyKnights.Common.Entity.EntityManager(this.FuzzyKnights);
		this.FuzzyKnights.Common.Game.GameLoop.AddManager(this.FuzzyKnights.Common.Entity.EntityManager);
		//@ PacketManager
		this.FuzzyKnights.Common.Message.Packet.PacketManager = new this.FuzzyKnights.Common.Message.Packet.PacketManager(this.FuzzyKnights);
		this.FuzzyKnights.Common.Game.GameLoop.AddManager(this.FuzzyKnights.Common.Message.Packet.PacketManager);
		

		//@ PlayerHandler
		this.FuzzyKnights.Common.Event.Handler.PlayerHandler = new this.FuzzyKnights.Common.Event.Handler.PlayerHandler(this.FuzzyKnights);
		//@ InputHandler
		this.FuzzyKnights.Common.Event.Handler.InputHandler = new this.FuzzyKnights.Common.Event.Handler.InputHandler(this.FuzzyKnights);
		//@ EntityHandler
		this.FuzzyKnights.Common.Event.Handler.EntityHandler = new this.FuzzyKnights.Common.Event.Handler.EntityHandler(this.FuzzyKnights);
		this.FuzzyKnights.Common.Event.Event.FuzzyKnights = this.FuzzyKnights;

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