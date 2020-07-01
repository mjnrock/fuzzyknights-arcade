import CanvasNode from "./CanvasNode";

export const EnumMessageType = {
    RENDER: "CanvasNode.Render",
    DRAW: "CanvasNode.Draw",
    ERASE: "CanvasNode.Erase",
};

/**
 * If a method is preceded be "g", then arg ∈ { X, Y, Width, Height } should be considered TILE entries
 * For Example: if rect(25,25,50,50) and tiles are 25x25, then gRect(1,1,2,2)
 */
export default class GridCanvasNode extends CanvasNode {
    constructor({ state = {}, config = {}, width, height, size } = {}) {
        super({ state, config, width, height });

        this.mergeState({
            tile: {
                width: size[ 0 ],
                height: size[ 1 ],
            }
        });
    }

    get tw() {
        return this.state.tile.width;
    }
    get th() {
        return this.state.tile.height;
    }

    get xqty() {
        return this.canvas.width / this.tw;
    }
    get yqty() {
        return this.canvas.height / this.th;
    }

    resizeTile(tw, th) {
        if(Number.isInteger(tw) && Number.isInteger(th)) {
            this.mergeState({
                tile: {
                    width: tw,
                    height: th,
                }
            });
        }

        return this;
    }

    /**
     * 
     * @param {string|number} round "floor"|"ceil"|/[0-9]/
     */
    normalize(x, y, w, h, { round = 0 } = {}) {
        if(String(round).match(/[0-9]/)) {
            x = parseFloat(x).toFixed(round);
            y = parseFloat(y).toFixed(round);
            w = parseFloat(w).toFixed(round);
            h = parseFloat(h).toFixed(round);
        } else if(round in Math) {
            x = Math[ round ](x);
            y = Math[ round ](y);
            w = Math[ round ](w);
            h = Math[ round ](h);
        }
        
        let tx = this.tw * x,
            ty = this.th * y,
            tw = this.tw * w,
            th = this.th * h;

        return {
            tx: tx,
            ty: ty,
            tw: tw,
            th: th,
        };
    }

    drawGrid({ fillStyle = "#000" } = {}) {
        this.prop({ fillStyle });

        for(let x = 0; x < this.xqty; x++) {
            for(let y = 0; y < this.yqty; y++) {
                this.gRect(
                    x,
                    y,
                    1,
                    1,
                    { isFilled: false }
                )
            }
        }
    }
    drawTransparency() {    
        let iter = 0;
        for (let x = 0; x < this.canvas.width; x += this.tw) {
            for (let y = 0; y < this.canvas.height; y += this.th) {
                this.ctx.fillStyle = (iter % 2 === 0) ? "#fff" : "#ddd";
                this.ctx.fillRect(x, y, this.tw, this.th);
                ++iter;
            }
            ++iter;
        }
    }
    
    gErase(x, y, w, h, { round = 0 } = {}) {
        const { tx, ty, tw, th } = this.normalize(x, y, w, h, { round });

        this.erase(tx, ty, tw, th);

        return this;
    }

    gRect(x, y, w, h, { isFilled = false, round = 0 } = {}) {
        const { tx, ty, tw, th } = this.normalize(x, y, w, h, { round });

        this.rect(tx, ty, tw, th, { isFilled });
        
        console.log(tx, ty, tw, th);

        return this;
    }
}