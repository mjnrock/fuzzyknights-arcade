import React from "react";
import { Grid, Segment } from "semantic-ui-react";

import GraphFactory from "./lib/GraphFactory";

function Tile(props) {
    let terrain = props.tile.terrain.type;

    return (
        <div style={{ height: 64, backgroundColor: terrain === "FLOOR" ? "#999" : "#555" }}>
            { props.x },{ props.y }
        </div>
    );
}

function Node(props) {
    const tiles = props.node.getTiles();
    const arr = [[]];
    let row = 0;
    tiles.forEach(([ x, y, tile ]) => {
        arr[ row ].push([ x, y, tile ]);
        
        if(y === props.node.tiles.height - 1) {
            row++;
            arr.push([]);
        }
    });

    return (
        <Grid>
            {
                arr.map((row, i) => {
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

function App() {
    const graph = GraphFactory.Generate(1, 1, 15, 15);

    return (
        <Segment>
            {
                Object.values(graph.nodes).map(node => {
                    return (
                        <Node key={ node.id } node={ node } />
                    );
                })
            }
        </Segment>
    );
}

export default App;
