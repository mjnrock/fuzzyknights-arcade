import React, { useState, useEffect } from "react";

import Base64 from "@lespantsfancy/hive/lib/client/util/Base64";

export default function Canvas(props) {
    const canvasRef = React.createRef();
    const [ canvas, setCanvas ] = useState();

    useEffect(() => {
        const ref = canvasRef.current;

        if(ref) {
            if(props.src) {
                Base64.Decode(props.src).then(setCanvas);
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

            ctx.drawImage(canvas, 0, 0)
        }
        // eslint-disable-next-line
    }, [ canvas ]);

    return (
        <canvas ref={ canvasRef } />
    );
};