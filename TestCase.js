export default function TestCase(FuzzyKnights, ...args) {
	let entity = new FuzzyKnights.Common.Entity.Entity(1, [
		new FuzzyKnights.Common.Component.Resources([
			[FuzzyKnights.Common.Component.Enum.ResourceType.HEALTH, 10, 15],
			[FuzzyKnights.Common.Component.Enum.ResourceType.MANA, 3, 5]
		])
	]);

	let TX = new FuzzyKnights.Common.Component.Transformer.Resources;
	console.log(TX.GetComponent(entity));
	console.log(TX.GetHealth(entity));
	console.log(TX.GetMana(entity));
};