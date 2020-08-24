/* eslint-disable */
import React from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";
import { Segment, List, Button, Modal, Icon } from "semantic-ui-react";

import { Context } from "../App";
import ViewManager from "../components/ViewManager";

function ColoredConfig({ setting } = {}) {
    const { node: game } = useNodeContext(Context);
    const value = game.setting(setting);

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

            <ViewManager />
        </Segment>
    )
}