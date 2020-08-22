/* eslint-disable */
import React from "react";
import Canvas from "../Canvas";

export default function GameView({ state, canvasProps = {}, style = {}, ...rest } = {}) {
    return (
        <div { ...rest } style={{ ...style }}>
            <Canvas src={ state.view.current.camera.canvas } { ...canvasProps } />
        </div>
    );
}