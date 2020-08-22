/* eslint-disable */
import React from "react";
import Canvas from "../Canvas";

import { Popup, Header, Grid, Button } from "semantic-ui-react";

//TODO Remove the direct key bindings from the View.js and invoke the same events from a Game.$.send(...) bound to these JSX Views, instead
//  This will allow you to press keys and differentiate the DOM elements (e.g. a click on the action button, triggers canvas events currently)

export default function GameView({ state, canvasProps = {}, style = {}, ...rest } = {}) {
    return (
        <div id="game-view" { ...rest } style={{ ...style }}>
            <Canvas src={ state.view.current.camera.canvas } { ...canvasProps } />

            <div style={{ position: "absolute", left: `calc(100vw / 2 - 64px * 3)`, top: `calc(100vh - 175px)`, width: "100%", }}>
                {
                    [ 1, 2, 3, 4, 5, 6 ].map(value => (
                        <Popup key={ value } trigger={(                        
                            <div className="action-button">
                                <span style={{ paddingLeft: 4, fontFamily: "monospace" }}>{ value }</span>
                            </div>
                        )} hoverable position="top center">
                            <Grid centered divided columns={ 1 }>
                                <Grid.Column textAlign="center">
                                    <Header as="h4">Protip</Header>
                                        <p>Don't be a tool</p>
                                    <Button>Gnar</Button>
                                </Grid.Column>
                            </Grid>
                        </Popup>
                    ))
                }
            </div>
        </div>
    );
}