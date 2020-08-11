import Note from "./Note";

export default class Conduit {
    constructor(entity, note) {
        this.entity = entity;
        this.note = note || new Note();
    }

    //TODO TBD on @game or @book
    // get(time, game) {
    // get(time, book) {
    get(time) {
        if(this.note) {
            if(this.note.isValid(time)) {
                return this.note.image;
            } else {
                //TODO Retrieve appropriate Note from Book
            }
        } else {
            this.note
        }
    }
};