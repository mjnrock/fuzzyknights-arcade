import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

// import CanvasNode from "./lib/hive/CanvasNode";
import GridCanvasNode from "./lib/hive/GridCanvasNode";
import ScrollToTop from "./ScrollToTop";
import Routes from "./routes/package";

//TODO Add a "UPDATE/REDRAW" to CanvasNode that any drawing command invokes
const cn = new GridCanvasNode({ width: 500, height: 500, size: [ 25, 25 ] });
// cn.rect(50, 50, 100, 100, { isFilled: true });

console.log(cn.tw, cn.th, cn.xqty, cn.yqty);

cn.drawTransparency();
cn.drawGrid();

cn.addReducer((state, msg) => {
    // if(msg.type !== "CanvasNode.Render") {
    //     console.log(msg);
    // }
    
    return {
        _time: Date.now(),
        ...state
    }
});

cn.addEffect((state, msg) => {
    if(Math.random() > 0.965) {        
        let obj = {
            r: ~~(Math.random() * 255),
            g: ~~(Math.random() * 255),
            b: ~~(Math.random() * 255),
            
            x: Math.random() * cn.xqty,
            y: Math.random() * cn.yqty,
            w: Math.random() * (cn.xqty / 3) + 1,
            h: Math.random() * (cn.yqty / 3) + 1,
        };

        cn.prop({
            fillStyle: `rgb(${ obj.r }, ${ obj.g }, ${ obj.b })`
        })
        cn.gRect(
            obj.x,
            obj.y,
            obj.w,
            obj.h,
            { isFilled: true },
        );
    }
})

cn.play();  // Begin requestAnimationFrame

export const Context = React.createContext(cn);

function App() {
    return (
        <Router>
            <ScrollToTop>
                <Context.Provider value={{ node: cn }}>
                    <Switch>                            
                        <Route path="/">
                            <Routes.Home />
                        </Route>
                    </Switch>
                </Context.Provider>
            </ScrollToTop>
        </Router>
    )
}

export default App;