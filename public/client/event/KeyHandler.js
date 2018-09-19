class KeyHandler {
	constructor() {
		window.addEventListener("keyup", this.OnKeyUp.bind(this), false);
		window.addEventListener("keydown", this.OnKeyDown.bind(this), false);
	}

	OnKeyUp(e) {
		console.log(this, e);
	}

	OnKeyDown(e) {
		console.log(this, e);
	}
}

export default new KeyHandler;