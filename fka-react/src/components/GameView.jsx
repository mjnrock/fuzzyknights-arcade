/* eslint-disable */
import React from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";

import { Context } from "../App";
import Canvas from "../Canvas";

export default function GameView({ canvasProps = {}, style = {}, ...rest } = {}) {
    const { state } = useNodeContext(Context);

    return (
        <div { ...rest } style={{ ...style }}>
            <Canvas src={ state.view.current.camera.canvas } { ...canvasProps } />
        </div>
    );
}