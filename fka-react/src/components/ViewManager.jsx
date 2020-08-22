/* eslint-disable */
import React, { Fragment, useEffect, useState } from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";

import { Button, Icon } from "semantic-ui-react";

import Game from "../lib/Game";
import { Context } from "../App";
import GameView from "../lib/view/GameView";
import TitleView from "../lib/view/TitleView";
import GameViewComponent from "./GameView";
import TitleViewComponent from "./TitleView";

export function Wrapper(props) {
    return (        
        <Fragment>
            <Button icon onClick={ e => {
                console.info(canvas.toDataURL("image/png"));
            }}>
                <Icon name="camera retro" />
                <Icon corner name="add" />
            </Button>
            
            { props.children }
        </Fragment>
    );
}

export default function ViewManager(props) {
    const { state } = useNodeContext(Context);
    const [ view, setView ] = useState(state.view.current);

    useEffect(() => {
        if(view !== state.view.current) {
            setView(state.view.current);
        }
    }, [ state.view.current, view ]);

    let current = null;
    if(view instanceof GameView) {
        current = (
            <GameViewComponent style={{ border: "10px solid #000" }} />
        );
    } else if(view instanceof TitleView) {
        current = (
            <TitleViewComponent onWorld={ (game, i) => {
                Game.$.view.start();
            }} />
        );
    }

    return (
        <Wrapper>
            { current }
        </Wrapper>
    );
}