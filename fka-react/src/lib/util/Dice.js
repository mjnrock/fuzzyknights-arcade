const Dice = {
	random: (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	roll: (x, y, z = 0) => {
		let value = 0;
		for(let i = 0; i < x; i++) {
			value += Dice.random(1, y);
		}
		
		return value + z;
	},

	coin: () => {
		return Dice.roll(1, 2) === 1 ? true : false;
	},

	d2: (z = 0) => {
		return Dice.roll(1, 2) + z;
	},
	d3: (z = 0) => {
		return Dice.roll(1, 3) + z;
	},
	d4: (z = 0) => {
		return Dice.roll(1, 4) + z;
	},
	d6: (z = 0) => {
		return Dice.roll(1, 6) + z;
	},
	d10: (z = 0) => {
		return Dice.roll(1, 10) + z;
	},
	d12: (z = 0) => {
		return Dice.roll(1, 12) + z;
	},
	d20: (z = 0) => {
		return Dice.roll(1, 20) + z;
	},
	d25: (z = 0) => {
		return Dice.roll(1, 25) + z;
	},
	d50: (z = 0) => {
		return Dice.roll(1, 50) + z;
	},
	d100: (z = 0) => {
		return Dice.roll(1, 100) + z;
	},

	weighted: (weights, values) => {                
		const total = weights.agg((a, v) => a + v, 0);		
		const roll = Dice.random(1, total);
		
		const count = 0;
		for(let i = 0; i < weights.length; i++) {
			count += weights[ i ];
			
			if(roll <= count) {
				return values[ i ];
			}
		}
		
		return values[ values.length - 1 ];
	}
}

export default Dice;