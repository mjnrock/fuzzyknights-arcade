import React, { useState, useEffect } from "react";

import Game from "./lib/Game";
import Base64 from "@lespantsfancy/hive/lib/client/util/Base64";

export default function Canvas(props) {
    let canvasRef = React.createRef();
    const [ canvas, setCanvas ] = useState();

    useEffect(() => {
        const ref = canvasRef.current;

        if(ref) {            
            if(props.src) {
                Base64.Decode(props.src).then(cvs => {
                    //FIXME Temp event association until Base64 class is modified to accommodate
                    if(props.src instanceof HTMLCanvasElement) {
                        cvs.onmousedown = props.src.onmousedown;
                    }

                    setCanvas(cvs);
                });
            }
        }
        // eslint-disable-next-line
    }, [ props ]);

    useEffect(() => {
        const ref = canvasRef.current;

        if(ref && canvas) {
            const ctx = ref.getContext("2d");

            ref.width = canvas.width;
            ref.height = canvas.height;

            //FIXME Temp event association until Base64 class is modified to accommodate
            ref.onmousedown = canvas.onmousedown;

            ctx.drawImage(canvas, 0, 0);

            if(Game.$.state.react.canvas !== ref) {
                Game.$.state.react.canvas = ref;
            }
        }
        // eslint-disable-next-line
    }, [ canvas ]);

    return (
        <canvas ref={ canvasRef } />
    );
};