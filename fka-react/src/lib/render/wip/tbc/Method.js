import Entity from "../../../entity/Entity";
// import Models from "./../../model/package";  //TODO Allow shapes to be expressed as canvas.toDataURL() of that Model being drawn as an accompanying command (e.g. Rectangle -> .rect, etc.)
import Base64 from "../../../util/Base64";
// HTMLImageElement, HTMLCanvasElement, Base64, Score/Composition, CanvasNode

export default class Method {
    constructor(vision) {
        this.vision = vision;
        
        if(vision instanceof HTMLImageElement) {
            this.image = vision;
        } else {
            const img = new Image();
            img.onload = () => {
                if(Base64.Is(vision)) {
                    Base64.Decode(vision).then(canvas => {
                        img.src = canvas.toDataURL();
                    });
                }
            };

            this.image = img;
        }
    }

    static isMethodable(vision) {
        return Base64.Is(vision);
            // || input instanceof Score
            // || input instanceof Composition;
    }

    perform(...args) {
        //  FIXME Files don't exist yet (Score & Composition)
        // if(this.vision instanceof Score || this.vision instanceof Composition) {
            // const [ facing, elapsedTime ] = args;
        //     return this.vision.get(...args);
        // }

        return this.image;
    }
};