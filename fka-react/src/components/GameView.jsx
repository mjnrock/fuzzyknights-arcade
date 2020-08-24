/* eslint-disable */
import React from "react";
import Canvas from "../GameCanvas";
import PlayerInventory from "./PlayerInventory";
import PlayerActionBar from "./PlayerActionBar";

//TODO Remove the direct key bindings from the View.js and invoke the same events from a Game.$.send(...) bound to these JSX Views, instead
//  This will allow you to press keys and differentiate the DOM elements (e.g. a click on the action button, triggers canvas events currently)

export default function GameView({ game, canvasProps = {}, style = {}, ...rest } = {}) {
    return (
        <div id="game-view" { ...rest } style={{ ...style }}>
            <Canvas src={ game.state.view.current.camera.canvas } { ...canvasProps } />

            <PlayerActionBar game={ game } />
            <PlayerInventory game={ game } />
        </div>
    );
}