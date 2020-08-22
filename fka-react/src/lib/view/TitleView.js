import View from "./View";

export default class TitleView extends View {
    constructor(games = []) {
        super({
            silent: true,
        });

        this.games = games;

        this.mergeState({
            mouse: null,
            key: null,
        });
    }

    receive(type, payload, msg) {}
}