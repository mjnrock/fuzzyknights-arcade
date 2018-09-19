class GameLoop {
	constructor(ticksPerSecond = 5, managers = []) {
		this.TicksPerSecond = ticksPerSecond;
		this.Managers = managers;

		this.Ticks = 0;
		this.LastTime = 0;

		this.IsPaused = false;
		this.Ticker = null;
		this.Timestamp = Date.now();
	}

	AddManager(manager) {
		this.Managers.push(manager);

		return this;
	}

	IsRunning() {
		return (!this.IsPaused) && (this.Ticker !== null && this.Ticker !== void 0);
	}
	Run() {
		//DEBUG
		// console.log("[Starting] Game Loop...");

		this.Ticker = setInterval(
			() => {
				if(!this.IsPaused) {
					this.Tick(Date.now());
				}
			},
			1000 / this.TicksPerSecond
		);

		//DEBUG
		// console.log("[Started] Game Loop...");
	}
	Stop() {
		//DEBUG
		// console.log("[Stopping] Game Loop...");

		clearInterval(this.Ticker);
		
		//DEBUG
		// console.log("[Stopped] Game Loop...");
	}
	
	Pause() {
		//DEBUG
		// console.log("[Pausing] Game Loop...");

		this.IsPaused = true;
	}	
	Play() {
		//DEBUG
		// console.log("[Playing] Game Loop...");

		this.IsPaused = false;
	}

	Tick(time) {
		++this.Ticks;

		let ms = time - this.LastTime;
		this.LastTime = time;

		for(let i = 0; i < this.Managers.length; i++) {
			this.Managers[i].Tick(ms / 1000);
		}
	}
}

export default new GameLoop();
export { GameLoop };