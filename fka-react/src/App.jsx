import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import CanvasNode from "./lib/hive/CanvasNode";
import ScrollToTop from "./ScrollToTop";
import Routes from "./routes/package";

//TODO Add a "UPDATE/REDRAW" to CanvasNode that any drawing command invokes
const cn = new CanvasNode({ width: 500, height: 500 });
cn.rect(50, 50, 100, 100, { isFilled: true });

cn.addReducer((state, msg) => {
    if(msg.type !== "CanvasNode.Render") {
        console.log(msg);
    }
    
    return {
        _time: Date.now(),
        ...state
    }
});

cn.addEffect((state, msg) => {
    if(Math.random() > 0.9) {
        cn.prop({
            fillStyle: `rgb(${ ~~(Math.random() * 255 ) }, ${ ~~(Math.random() * 255 ) }, ${ ~~(Math.random() * 255 ) })`
        })
        cn.rect(
            Math.random() * cn.width,
            Math.random() * cn.height,
            Math.random() * 100,
            Math.random() * 100,
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