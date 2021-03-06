/* eslint-disable */
import React, { useEffect, useState, Fragment } from "react";
import { EnumComponentType } from "../lib/entity/components/Component";

import { Header, Popup, Grid } from "semantic-ui-react";

export function InventoryItem({ itemStack, ...rest } = {}) {
    if(itemStack && itemStack.item) {
        return (
            <>
                <Header as="h4">{ itemStack.item.name }</Header>
                <p>Qty: { itemStack.qty }</p>
            </>
        );
    }

    return null;
}

export function Slot({ slot, index, ...rest } = {}) {
    //TODO  Fire an "activate slot" command to the Player channel
    function onClick(e) {
        console.log(slot.id);
    }

    if(slot.itemStack) {
        return (
            <Popup trigger={(
                //  STUB    inventory-slot--full
                <div
                    className="inventory-slot inventory-slot--full"
                    onClick={ onClick }
                    { ...rest }
                >{ index }</div>
            )} hoverable position="top center">
                <Grid centered divided columns={ 1 }>
                    <Grid.Column textAlign="center">
                        <InventoryItem itemStack={ slot.itemStack } />
                    </Grid.Column>
                </Grid>
            </Popup>
        );
    }

    return (
        <div
            className="inventory-slot"
            onClick={ onClick }
            { ...rest }
        >{ index }</div>
    );
}

//TODO  Use react-beautiful-dnd for the drag and drop
function PlayerEquipment({ game, ...rest } = {}) {
    const { player } = game;
    const [ inventory, setInventory ] = useState([]);
    const canvas = game.react.canvas ? game.react.canvas.getBoundingClientRect() : {};

    useEffect(() => {
        const inv = player.getComponent(EnumComponentType.STORAGE);

        if(inv) {
            setInventory(inv.equipment.toSlotArray(true));
        }
    }, [ player ]);

    return (
        <div
            className="inventory"        
            style={{
                left: (canvas.right || 0) - 325,
                top: (canvas.bottom || 0) - 350,
            }}
        >
            {
                // inventory.map(slot => (
                //     <Fragment key={ slot.id }>
                inventory.map(([ key, slot ]) => (
                    <Fragment key={ key }>
                        <Slot slot={ slot } index={ key } />
                    </Fragment>
                ))
            }
        </div>
    );
}

export default React.memo(PlayerEquipment, (props, nextProps) => {
    const { player } = props.game;
    const { player: nextPlayer } = nextProps.game;
    const inv = player.getComponent(EnumComponentType.STORAGE);
    const nextInv = nextPlayer.getComponent(EnumComponentType.STORAGE);

    if(inv !== nextInv) {   // STUB Partial stub, employ a hash comparison similar to PlayerActionBar
        return false;
    }

    return true;
});