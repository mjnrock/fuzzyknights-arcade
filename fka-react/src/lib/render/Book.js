import Score from "./sequencer/Score";
import Composition from "./sequencer/Composition";

export default class Book {
    constructor(entries = []) {
        this.entries = new Map(entries);
    }

    get(key) {
        return this.entries.get(key);
    }
    set(key, score) {
        if(score instanceof Score || score instanceof Composition) {
            this.entries.set(key, score);
        }

        return this;
    }
};