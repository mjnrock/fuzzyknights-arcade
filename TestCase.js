export default function TestCase(FuzzyKnights, ...args) {
	let entity = new FuzzyKnights.Common.Entity.Creature.Creature(
		[
			// new FuzzyKnights.Common.Component.Attributes([
			// 	[FuzzyKnights.Common.Component.Enum.AttributeType.MIGHT, 10],
			// 	[FuzzyKnights.Common.Component.Enum.AttributeType.TOUGHNESS, 10]
			// ]),
			new FuzzyKnights.Common.Component.Maps([
				[FuzzyKnights.Common.Component.Enum.MapType.TILE, 0, 0]
			])
		]
	);
	let entity2 = new FuzzyKnights.Common.Entity.Creature.Creature(
		[
			// new FuzzyKnights.Common.Component.Attributes([
			// 	[FuzzyKnights.Common.Component.Enum.AttributeType.MIGHT, 10],
			// 	[FuzzyKnights.Common.Component.Enum.AttributeType.TOUGHNESS, 10]
			// ]),
			new FuzzyKnights.Common.Component.Maps([
				[FuzzyKnights.Common.Component.Enum.MapType.TILE, 1, 1]
			])
		]
	);
	let terrain = new FuzzyKnights.Common.Entity.Terrain.Grass(
		[
			// new FuzzyKnights.Common.Component.Attributes([
			// 	[FuzzyKnights.Common.Component.Enum.AttributeType.MIGHT, 10],
			// 	[FuzzyKnights.Common.Component.Enum.AttributeType.TOUGHNESS, 10]
			// ]),
			new FuzzyKnights.Common.Component.Maps([
				[FuzzyKnights.Common.Component.Enum.MapType.TILE, 0, 0]
			])
		]
	);

	let map = new FuzzyKnights.Common.World.Tile.Map(2, 2);	
	let node = map.GetNode(0, 0);
	
	// FuzzyKnights.Common.Component.Mutator.Maps.GetComponent(entity)

	// console.log(JSON.stringify(entity));
	// console.log(JSON.stringify(map.Grid.ToArray()));
	// console.log(JSON.stringify(FuzzyKnights.Common.Component.Mutator.Maps.GetComponent(entity)));
	

	// map.IsOccupied();
	// console.log(map.IsOccupied());
	node.AddEntity(entity);
	FuzzyKnights.Common.World.Tile.TileManager.SetMap(0, 0, map);
	FuzzyKnights.Common.Component.Mutator.Maps.SetMap(entity, map);
	
	let m2 = FuzzyKnights.Common.Component.Mutator.Maps.Move(entity, 0, 0, 1, 1);
	console.log(JSON.stringify(entity));
	// console.log(JSON.stringify(node));
	// map.IsOccupied();
	// console.log(map.IsOccupied());

	// console.log(JSON.stringify(map));
};

//	WORLD GENERATION
// let map = FuzzyKnights.Common.World.Tile.MapGenerator.RandomAverage(20, 20);
// // let map = FuzzyKnights.Common.World.Tile.MapGenerator.CellularAutomata(20, 20);

// map.Run();
// console.log(map.Cells.Elements.map(v => v.join(",")).join("\n"));
// // console.log(JSON.stringify(map.Cells.Elements));