/* eslint-disable */
import React from "react";

import { Popup, Header, Grid, Button } from "semantic-ui-react";

export default function PlayerActionBar({ game, ...rest } = {}) {
    // const { player } = game;
    // const canvas = game.react.canvas ? game.react.canvas.getBoundingClientRect() : {};

    return (
        <div style={{ position: "absolute", left: `calc(100vw / 2 - 64px * 3)`, top: `calc(100vh - 175px)`, }}>
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
    );
}