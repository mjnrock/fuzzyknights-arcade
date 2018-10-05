import { Singleton } from "./Singleton.js";

class Attribute extends Singleton {
	constructor(type, value, modifiers = []) {
		super(type);
		
		this.Value = value;
		this.Modifiers = modifiers;
	}

	GetTotalValue() {		
		return this.Value + this.Modifiers.reduce((a, v) => a + v.Value, 0);		
	}

	GetValue() {
		return this.Value;
	}
	SetValue(value) {
		this.Value = value;
		
		return this;
	}
	
	GetModifiers() {
		return this.Modifiers;
	}
	SetModifiers(modifiers) {
		this.Modifiers = modifiers;
		
		return this;
	}
	AddModifier(...modifiers) {
		modifiers.forEach((v) => this.Modifiers.push(v));
		
		return this;
	}

	RemoveExpiredModifiers() {
		this.Modifiers = this.Modifiers.filter((v) => !v.IsExpired());

		return this;
	}
}

export { Attribute };