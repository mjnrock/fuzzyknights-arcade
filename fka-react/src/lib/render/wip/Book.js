import Score from "./../sequencer/Score";

export default class Book {
    constructor(entries = []) {
        this.entries = new Map(entries);
    }

    get(key) {
        return this.entries.get(key);
    }
    set(key, score) {
        if(score instanceof Score) {
            this.entries.set(key, score);
        }
    }
};