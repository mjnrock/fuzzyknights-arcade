class WorldManager {
	constructor(fk) {
		this.FuzzyKnights = fk;
		
		//! Don't add this.Players to this.Tick(), let lower tier Managers handle the Player's Entity's ticks so this can remain a "game level" repository for the Players
		this.Players = {};
	}

	AddPlayer(player) {
		this.Players[player.UUID] = player;

		return this;
	}
	RemovePlayer(input) {
		if(typeof input === "string" || input instanceof String) {
			delete this.Players[input];
		} else if(input instanceof Player) {
			delete this.Players[input.UUID];
		}

		return this;
	}

	Tick(time) {

	}
}

export { WorldManager };