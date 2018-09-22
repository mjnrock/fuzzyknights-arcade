class Facing {
	constructor(yaw, pitch, roll, isDegree = true) {
		this.Yaw = yaw;
		this.Pitch = pitch;
		this.Roll = roll;
		this.IsDegree = isDegree;	// or Radians
	}

	Get(isDegree = true) {
		if(IsDegree) {				// Return Type
			if(this.isDegree) {		// Stored Information
				return {
					Yaw: this.Yaw,
					Pitch: this.Pitch,
					Roll: this.Roll,
					IsDegree: IsDegree
				};
			} else {
				return {
					Yaw: this.Yaw * 180 / Math.PI,
					Pitch: this.Pitch * 180 / Math.PI,
					Roll: this.Roll * 180 / Math.PI,
					IsDegree: IsDegree
				};
			}
		} else {
			if(this.isDegree) {		// Stored Information
				return {
					Yaw: this.Yaw * Math.PI / 180,
					Pitch: this.Pitch * Math.PI / 180,
					Roll: this.Roll * Math.PI / 180,
					IsDegree: IsDegree
				};
			} else {
				return {
					Yaw: this.Yaw,
					Pitch: this.Pitch,
					Roll: this.Roll,
					IsDegree: IsDegree
				};
			}
		}
	}
	GetDegrees() {
		return this.Get(true);
	}
	GetRadians() {
		return this.Get(false);
	}
}

export { Facing };