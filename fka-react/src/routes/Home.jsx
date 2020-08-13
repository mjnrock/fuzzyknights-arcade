import React from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";
import { Segment, Message } from "semantic-ui-react";

import { Context } from "../App";
import Canvas from "../Canvas";

export default function Home(props) {
    const { node } = useNodeContext(Context);

    return (
        <Segment>
            <Message>
                <Message.Header>Key Bindings</Message.Header>
                <Message.List>
                    <Message.Item><kbd>F3</kbd> Toggle Debug Mode</Message.Item>
                    <Message.Item><kbd>V</kbd> Toggle Life Bars</Message.Item>
                </Message.List>
            </Message>
            <Canvas src={ node.canvas } />
        </Segment>
    )
}