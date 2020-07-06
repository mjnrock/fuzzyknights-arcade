import React from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";
import { Segment } from "semantic-ui-react";

import { Context } from "../App";
import Canvas from "../Canvas";

export default function Home(props) {
    const { node } = useNodeContext(Context);

    console.log(node);

    return (
        <Segment>
            <p>{ node.fps }</p>
            <Canvas src={ node.canvas } />
        </Segment>
    )
}