export default function TestCase(FuzzyKnights, ...args) {
	let entity = new FuzzyKnights.Common.Entity.Entity(1, [
		new FuzzyKnights.Common.Component.Attributes([
			[FuzzyKnights.Common.Component.Enum.AttributeType.MIGHT, 10],
			[FuzzyKnights.Common.Component.Enum.AttributeType.TOUGHNESS, 9, [
				new FuzzyKnights.Common.Component.Element.AttributeModifier(5, 3000),
				new FuzzyKnights.Common.Component.Element.AttributeModifier(3, 3000),
				new FuzzyKnights.Common.Component.Element.AttributeModifier(11, 0, FuzzyKnights.Common.Component.Enum.AttributeModifierType.INHERENT)
			]]
		])
	]);

	let TX = new FuzzyKnights.Common.Component.Mutator.Attributes(FuzzyKnights);
	console.log("-------------\n", TX.GetComponent(entity).Serialize());
	console.log("-------------\n", TX.GetMight(entity).GetValue());
	console.log("-------------\n", TX.GetMight(entity).GetTotalValue());
	console.log("-------------\n", TX.GetToughness(entity).GetValue());
	console.log("-------------\n", TX.GetToughness(entity).GetTotalValue());

	setTimeout(() => {
		console.log("-------------\n", TX.GetMight(entity).GetTotalValue());
		console.log("-------------\n", TX.GetToughness(entity).GetTotalValue());
	}, 3500);
};