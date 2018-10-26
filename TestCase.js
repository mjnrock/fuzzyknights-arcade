export default function TestCase(FuzzyKnights, ...args) {
	let map = FuzzyKnights.Common.World.Tile.MapGenerator.RandomAverage(20, 20);
	// let map = FuzzyKnights.Common.World.Tile.MapGenerator.CellularAutomata(20, 20);

	map.Run();
	console.log(map.Cells.Elements.map(v => v.join(",")).join("\n"));
	// console.log(JSON.stringify(map.Cells.Elements));
};