import Hive from "@lespantsfancy/hive";
import { Bitwise } from "./Helper";

export const EnumEventType = {
    MOUSE_MASK: "MouseNode.Mask",
    MOUSE_DOWN: "MouseNode.Down",
    MOUSE_UP: "MouseNode.Up",
    MOUSE_SELECTION: "MouseNode.Selection",
    MOUSE_SWIPE: "MouseNode.Selection",
};

export default class MouseNode extends Hive.Node {
    constructor({ element } = {}) {
        super();

        this._config = {
            ...this.config,
            allowComplexActions: false,
            swipe: {
                timeout: 500,
                threshold: 75,
            }
        };

        this.state = {
            map: [
                {
                    button: 0,
                    flag: 2 << 0,
                    name: "LEFT",
                },
                {
                    button: 1,
                    flag: 2 << 1,
                    name: "MIDDLE",
                },
                {
                    button: 2,
                    flag: 2 << 2,
                    name: "RIGHT",
                },
            ],
            mask: 0,
            selection: [],
            swipe: [],
        };

        if(element) {
            element.onmousedown = e => this.onMouseDown.call(this, e);
            element.onmouseup = e => this.onMouseUp.call(this, e);
        }
    }

    updateMask(e) {
        let mask = this.state.mask;

        for(let entry of this.state.map) {
            if(entry.button === e.button) {
                if(Bitwise.has(mask, entry.flag)) {
                    mask = Bitwise.remove(mask, entry.flag);
                } else {
                    mask = Bitwise.add(mask, entry.flag)
                }
            }
        }
        this.state = {
            ...this.state,
            mask
        };

        if(this.config.allowComplexActions === true) {
            this.dispatch(EnumEventType.MOUSE_MASK, this.state.mask);
        }
    }

    get _selection() {
        return {
            begin: (e) => {
                this.state.selection = [];
                this.state.selection.push([ e.x, e.y ]);
            },
            end: (e) => {
                this.state.selection.push([ e.x, e.y ]);

                const [ [ x0, y0 ], [ x1, y1 ] ] = this.state.selection;
                this.dispatch(EnumEventType.MOUSE_SELECTION, {
                    start: {
                        x: x0,
                        y: y0,
                    },
                    end: {
                        x: x1,
                        y: y1,
                    },
                    width: x1 - x0,
                    height: y1 - y0,
                });
                this.state.selection = [];
            },
        }
    }
    get _swipe() {
        return {
            begin: (e) => {
                this.state.swipe = [];
                this.state.swipe.push([ e.x, e.y, Date.now() ]);
            },
            end: (e) => {
                this.state.swipe.push([ e.x, e.y, Date.now() ]);

                const [ [ x0, y0, t0 ], [ x1, y1, t1 ] ] = this.state.swipe;
                const dx = x1 - x0;
                const dy = y1 - y0;
                const dt = t1 - t0;

                if(dt <= this.config.swipe.timeout && (Math.abs(dx) >= this.config.swipe.threshold || Math.abs(dy) >= this.config.swipe.threshold)) {
                    let dir;

                    if(Math.abs(dx) >= Math.abs(dy)) {
                        // X Dominant
                        if(dx > 0) {
                            dir = "right";
                        } else {                            
                            dir = "left";
                        }
                    } else {
                        // Y Dominant
                        if(dy > 0) {
                            dir = "down";
                        } else {                            
                            dir = "up";
                        }
                    }

                    this.dispatch(EnumEventType.MOUSE_SWIPE, {
                        start: {
                            x: x0,
                            y: y0,
                        },
                        end: {
                            x: x1,
                            y: y1,
                        },
                        magnitude: {
                            x: dx,
                            y: dy
                        },
                        direction: dir,
                    });
                }
                this.state.swipe = [];
            },
        }
    }

    onMouseDown(e) {
        e.preventDefault();

        this.updateMask(e);
        this.dispatch(EnumEventType.MOUSE_DOWN, e);

        this._selection.begin(e);
        this._swipe.begin(e);
    }
    onMouseUp(e) {
        e.preventDefault();

        this.updateMask(e);
        this.dispatch(EnumEventType.MOUSE_UP, e);

        this._selection.end(e);
        this._swipe.end(e);
    }
}