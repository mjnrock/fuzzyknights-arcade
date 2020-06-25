import Graph from "./Graph";
import Node from "./Node";
import Tile from "./Tile";
import Terrain, { EnumTerrainType } from "./Terrain";

export default class GraphFactory {
    static Generate(gw, gh, nw, nh) {
        const graph = new Graph();

        for(let w = 0; w < gw; w++) {
            for(let h = 0; h < gh; h++) {
                const node = new Node();

                node.seed(nw, nh, function(x, y) {
                    let tile;

                    if(this.isEdge(x, y)) {
                        tile = new Tile(
                            new Terrain(EnumTerrainType.WALL), {
                            isNavigable: false
                        });
                    } else {
                        tile = new Tile(
                            new Terrain(EnumTerrainType.FLOOR), {
                            isNavigable: true
                        });
                    }

                    return tile;
                });

                graph.addNode(w, h, node);
            }
        }

        return graph;
    }
};