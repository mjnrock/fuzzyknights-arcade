/* eslint-disable */
import React from "react";

export function Row({ children, ...rest } = {}) {
    return (
        <div { ...rest }>
            { children }
        </div>
    );
}

export default function PlayerInventory({ game, ...rest } = {}) {
    const { player } = game;
    const canvas = game.react.canvas ? game.react.canvas.getBoundingClientRect() : {};
    const [ rows, cols ] = [ 3, 4 ];

    function render() {
        let ret = [];

        for(let r = 0; r < rows; r++) {
            const row = [];
            for(let c = 0; c < cols; c++) {
                row.push((
                    <div
                        key={ `${ c }.${ r }` }
                        className="inventory-slot"
                    >{ `${ c }.${ r }` }</div>
                ));
            }

            ret.push((
                <Row
                    key={ r }
                    className="inventory-row"
                >
                    { row }
                </Row>
            ))
        }

        return ret;
    }

    return (
        <div
            className="inventory"
            style={{
                left: (canvas.right || 0) - 325,
                top: (canvas.bottom || 0) - 250,
            }}
        >
            <span>Inventory</span>
            {
                render()
            }
        </div>
    );
}