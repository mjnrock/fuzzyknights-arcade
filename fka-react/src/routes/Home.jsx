/* eslint-disable */
import React, { useState } from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";
import { Segment, List, Button, Modal, Icon } from "semantic-ui-react";

import { Context } from "../App";
import GameView from "./../components/GameView";
import TitleView from "./../components/TitleView";
import Game from "../lib/Game";

function ColoredConfig({ setting } = {}) {
    const { state } = useNodeContext(Context);
    const value = state.game.setting(setting);

    return (
        <span
            style={{
                fontWeight: "bold",
                color: value ? "#5c9e6a" : "#993333",
            }}
        >{ String(value) }</span>
    )
}

export default function Home(props) {
    const [ world, setWorld ] = useState(); //TODO Transition to an internal Game flag (e.g. isRunning) with a reaction to GAME_START/GAME_STOP

    console.log(Game.$.view.current)

    return (
        <Segment>
            <Modal
                trigger={
                    <Button icon>
                        <Icon name="keyboard outline" />
                    </Button>
                }
                header="Key Bindings"
                content={
                    <List style={{ padding: 16 }}>
                        <List.Item><kbd>F3</kbd> Toggle Debug Mode [ <ColoredConfig setting={ "isDebugMode" } /> ]</List.Item>
                        <List.Item><kbd>V</kbd> Toggle Life Bars [ <ColoredConfig setting={ "showNameplates" } /> ]</List.Item>
                    </List>
                }
            />

            {
                world ? (
                    <GameView />
                ) : (
                    <TitleView onWorld={ (game, i) => {
                        setWorld(game);
                        Game.$.view.start();
                    }} />
                )
            }
        </Segment>
    )
}