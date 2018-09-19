import Bitwise from "./../../common/utility/Bitwise.js";
import EnumPlayerKeyState from "./../enum/PlayerKeyState.js";

class KeyHandler {
	constructor() {
		this.KeyBindings = {	// By this setup, these should map 1-to-1 with PlayerKeyStates
			LEFT: [37, 65],
			RIGHT: [39, 68],
			UP: [38, 87],
			DOWN: [40, 83]
		};
		this.PlayerKeyState = EnumPlayerKeyState.IDLE;

		window.addEventListener("keyup", this.OnKeyUp.bind(this), false);
		window.addEventListener("keydown", this.OnKeyDown.bind(this), false);
	}

	OnKeyUp(e) {
		if(e.keyCode !== 116 && e.keyCode !== 16) {		//! [F5] & [Shift]
			e.preventDefault();
		}

		this.FlagController(e.keyCode, false);
	}

	OnKeyDown(e) {
		if(e.keyCode !== 116 && e.keyCode !== 16) {		//! [F5] & [Shift]
			e.preventDefault();
		}

		this.FlagController(e.keyCode, true);
		
		console.log(this.PlayerKeyState);
	}

	FlagController(keyCode, isAdd = true) {
		for(let key in this.KeyBindings) {
			if(this.KeyBindings[key].includes(keyCode)) {
				if(!!isAdd) {
					this.PlayerKeyState = Bitwise.Add(this.PlayerKeyState, EnumPlayerKeyState[key]);
				} else {
					this.PlayerKeyState = Bitwise.Remove(this.PlayerKeyState, EnumPlayerKeyState[key]);
				}
			}
		}
	}
}

export default new KeyHandler;