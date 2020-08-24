/* eslint-disable */
import React from "react";
import { Popup, Header, Grid } from "semantic-ui-react";

import { EnumComponentType } from "./../lib/entity/components/Component";
import { EnumActionType } from "./../lib/combat/Action";
import { useState } from "react";
import { useEffect } from "react";

function PlayerActionBar({ game, ...rest } = {}) {
    const { player } = game;
    const [ capabilities, setCapabilities ] = useState([]);

    useEffect(() => {
        const caps = player.getComponent(EnumComponentType.CAPABILITIES);

        if(caps) {
            setCapabilities([ ...caps.current.entries() ]);
        }
    }, [ player ]);
    // const canvas = game.react.canvas ? game.react.canvas.getBoundingClientRect() : {};

    console.log(1)

    return (
        <div style={{ position: "absolute", left: `calc(100vw / 2 - 64px * 3)`, top: `calc(100vh - 175px)`, }}>
            {
                capabilities.map(([ name, action ]) => (
                    <Popup key={ name } trigger={(                        
                        <div className="action-button">
                            <span style={{ paddingLeft: 4, fontFamily: "monospace" }}>{ name }</span>
                        </div>
                    )} hoverable position="top center">
                        <Grid centered divided columns={ 1 }>
                            <Grid.Column textAlign="center">
                                <Header as="h4">{ name }</Header>
                                <p>Type: { EnumActionType.flagToName(action.type) }</p>
                                {
                                    action.type === EnumActionType.ABILITY ? (
                                        <p>Cooldown: { action.consequence.cooldown } ms</p>
                                    ) : null
                                }
                            </Grid.Column>
                        </Grid>
                    </Popup>
                ))
            }
        </div>
    );
}

export default React.memo(PlayerActionBar, (props, nextProps) => {
    const { player } = props.game;
    const { player: nextPlayer } = nextProps.game;
    const caps = player.getComponent(EnumComponentType.CAPABILITIES);
    const nextCaps = nextPlayer.getComponent(EnumComponentType.CAPABILITIES);

    if(caps && nextCaps && caps.hash !== nextCaps.hash) {
        return false;
    }

    return true;
});