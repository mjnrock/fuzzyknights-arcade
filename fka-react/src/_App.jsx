import React from "react";
import { Grid, Segment } from "semantic-ui-react";

import GraphFactory from "./lib/GraphFactory";
import CanvasNode from "./lib/hive/CanvasNode";
import Canvas from "./Canvas";

function Tile(props) {
    let terrain = props.tile.terrain.type;

    return (
        <div style={{ height: 64, backgroundColor: terrain === "FLOOR" ? "#999" : "#555" }}>
            { props.x },{ props.y }
        </div>
    );
}

function Node(props) {
    const tiles = props.node.toTileArray();

    return (
        <Grid>
            {
                tiles.map((row, i) => {
                    return (
                        <Grid.Row key={ i } columns={ props.node.tiles.width } textAlign="center" style={{ padding: 0, fontFamily: "monospace" }}>
                            {
                                row.map(([ x, y, tile ]) => {
                                    return (
                                        <Grid.Column key={ `${ x }.${ y }` } style={{ padding: 0 }}>
                                            <Tile x={ x } y={ y } tile={ tile } />
                                        </Grid.Column>
                                    )
                                })
                            }
                        </Grid.Row>
                    )
                })
            }
        </Grid>
    );
}

// function App() {
//     const graph = GraphFactory.Generate(1, 1, 15, 15);

//     return (
//         <Segment>
//             {
//                 Object.values(graph.nodes).map(node => {
//                     return (
//                         <Node key={ node.id } node={ node } />
//                     );
//                 })
//             }
//         </Segment>
//     );
// }



function App() {
    return (
        <Canvas 
    )
}

export default App;