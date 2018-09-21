class Handler {
	constructor(fk) {
		this.FuzzyKnights = fk;
		this.Events = {};
	}

	AddEvent(name, fn) {
		this.Events[name] = fn;

		return this;
	}
	RemoveEvent(name) {
		delete this.Events[name];

		return this;
	}

	GetEvent(name) {
		return this.Events[name];
	}
	InvokeEvent(name, ...args) {
		if(typeof this.Events[name] === "function") {
			let res = (this.Events[name])(...args);
			
			return res;
		}

		return false;
	}

	BuildEventMessage(messageType, eventType, payload) {
		return this.FuzzyKnights.Common.Message.MessageManager.BuildMessage(messageType, eventType, payload);
	}
}

export { Handler };