/* eslint-disable */
import React, { useEffect, useState, Fragment } from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";

import { Button, Icon, Container } from "semantic-ui-react";

import { Context } from "../App";
import Canvas from "../Canvas";

export default function GameView(props) {
    const { node, state } = useNodeContext(Context);
    const [ canvas, setCanvas ] = useState(state.view.current.camera.canvas);

    useEffect(() => {
        const fn = state => setCanvas(state.view.current.camera.canvas);
        node.addEffect(fn);

        return () => node.removeEffect(fn);
    }, []);

    return (
        <Fragment>
            <Button icon onClick={ e => {
                console.info(canvas.toDataURL("image/png"));
            }}>
                <Icon name="camera retro" />
                <Icon corner name="add" />
            </Button>
            
            <Canvas src={ state.view.current.camera.canvas } />
        </Fragment>
    )
}