/* eslint-disable */
import React, { useEffect, useState, Fragment } from "react";
import { EnumComponentType } from "../lib/entity/components/Component";

export function Slot({ slot, index, ...rest } = {}) {
    if(slot.item) {    
        return (
            <div className="inventory-slot" { ...rest } onClick={ e => console.log(slot.id) }>
                { slot.id }
            </div>
        );
    }

    return (
        <div className="inventory-slot" { ...rest } onClick={ e => console.log(slot.id) }>{ index }</div>
    );
}

//TODO  Use react-beautiful-dnd for the drag and drop
function PlayerInventory({ game, ...rest } = {}) {
    const { player } = game;
    const [ inventory, setInventory ] = useState([]);
    const canvas = game.react.canvas ? game.react.canvas.getBoundingClientRect() : {};

    useEffect(() => {
        const inv = player.getComponent(EnumComponentType.STORAGE);

        if(inv) {
            setInventory(inv.bags.toSlotArray());
        }
    }, [ player ]);

    return (
        <div
            className="inventory"        
            style={{
                left: (canvas.right || 0) - 325,
                top: (canvas.bottom || 0) - 250,
            }}
        >
            {
                // inventory.map(slot => (
                //     <Fragment key={ slot.id }>
                inventory.map(([ i, slot ]) => (
                    <Fragment key={ i }>
                        <Slot slot={ slot } index={ i } />
                    </Fragment>
                ))
            }
        </div>
    );
}

export default React.memo(PlayerInventory, (props, nextProps) => {
    const { player } = props.game;
    const { player: nextPlayer } = nextProps.game;
    const inv = player.getComponent(EnumComponentType.STORAGE);
    const nextInv = nextPlayer.getComponent(EnumComponentType.STORAGE);

    if(inv !== nextInv) {   // STUB Partial stub, employ a hash comparison similar to PlayerActionBar
        return false;
    }

    return true;
});