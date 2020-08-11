export default class Note {
    constructor(image, { duration = false, start = Date.now() } = {}) {
        this.image = image;
        this.expiration = duration === false ? false : start + duration;
    }

    isValid(time) {
        return this.expiration === false ? true : time < this.expiration;
    }

    recycle(image, { duration = false, start = Date.now() } = {}) {        
        this.image = image;
        this.expiration = duration === false ? false : start + duration;

        return this;
    }

    static Create(image, { duration, start } = {}) {
        return new Note(image, { duration, start });
    }
};