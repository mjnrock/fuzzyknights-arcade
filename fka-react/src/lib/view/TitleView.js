import Game from "../Game";
import View from "./View";

export default class TitleView extends View {
    constructor(games = []) {
        super();

        this.games = games;
    }

    receive(type, payload, msg) {}
}