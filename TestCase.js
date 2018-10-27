export default function TestCase(FuzzyKnights, ...args) {
	let entity = new FuzzyKnights.Common.Entity.Entity(
		1,
		[
			// new FuzzyKnights.Common.Component.Attributes([
			// 	[FuzzyKnights.Common.Component.Enum.AttributeType.MIGHT, 10],
			// 	[FuzzyKnights.Common.Component.Enum.AttributeType.TOUGHNESS, 10]
			// ]),
			new FuzzyKnights.Common.Component.Maps([
				[FuzzyKnights.Common.Component.Enum.MapType.TILE, 2, 2]
			])
		]
	);

	let map = new FuzzyKnights.Common.World.Tile.Map(25, 25);

	console.log(JSON.stringify(entity));
};

//	WORLD GENERATION
// let map = FuzzyKnights.Common.World.Tile.MapGenerator.RandomAverage(20, 20);
// // let map = FuzzyKnights.Common.World.Tile.MapGenerator.CellularAutomata(20, 20);

// map.Run();
// console.log(map.Cells.Elements.map(v => v.join(",")).join("\n"));
// // console.log(JSON.stringify(map.Cells.Elements));