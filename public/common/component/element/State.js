import Bitwise from "./../../utility/Bitwise.js";
import { Element } from "./Element.js";

class State extends Element {
	constructor(type, value) {
		super(type);
		
		this.Value = value;
	}

	Add(...flags) {
		return Bitwise.Add(this.Value, ...flags);
	}
	Remove(...flags) {
		this.Value = Bitwise.Remove(this.Value, ...flags);
		
		return this;
	}

	Has(flag) {
		return Bitwise.Has(this.Value, flag);
	}
}

export { State };