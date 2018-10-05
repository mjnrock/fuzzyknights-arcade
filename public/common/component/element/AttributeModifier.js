class AttributeModifier {
	constructor(value, duration) {
		this.Value = value;

		//@param Duration	The duration in milliseconds
		this.Duration = duration;
		this.Timestamp = Date.now();
	}

	GetValue() {
		return this.Value;
	}
	SetValue(value) {
		this.Value = value;
		
		return this;
	}

	GetDuration() {
		return this.Duration;
	}
	SetDuration(duration) {
		this.Duration = duration;
		
		return this;
	}

	IsExpired() {
		return this.Timestamp + this.Duration < Date.now();
	}
}

export { AttributeModifier };