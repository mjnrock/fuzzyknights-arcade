/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";

import Game from "../lib/Game";
import { Context } from "../App";
import GameView from "../lib/view/GameView";
import TitleView from "../lib/view/TitleView";
import GameViewComponent from "./GameView";
import TitleViewComponent from "./TitleView";

export default function ViewManager(props) {
    const { state } = useNodeContext(Context);
    const [ view, setView ] = useState(state.view.current);

    useEffect(() => {
        if(view !== state.view.current) {
            setView(state.view.current);
        }
    }, [ state.view.current, view ]);

    if(view instanceof GameView) {
        return (
            <GameViewComponent />
        );
    } else if(view instanceof TitleView) {
        return (
            <TitleViewComponent onWorld={ (game, i) => {
                Game.$.view.start();
            }} />
        );
    }

    return null;
}