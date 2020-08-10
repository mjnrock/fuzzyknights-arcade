import Method from "./Method";

export default class Character {
    constructor(...methods) {
        if(Array.isArray(methods[ 0 ]) && methods[ 0 ].length === 2) {
            this.methods = new Map(methods.map(([ name, method ]) => [ name, method ]));
        } else {
            this.methods = new Set(methods);
        }
        this.role = methods.get(0) || methods.get(methods[ 0 ][ 1 ]);
    }

    change(nameOrIndex) {
        this.role = this.methods.get(nameOrIndex);

        return this;
    }

    grow(method, name) {
        if(method instanceof Method) {
            if(this.methods instanceof Set) {
                this.methods.add(method);
            } else if(this.methods instanceof Map && name) {
                this.methods.set(name, method);
            }
        } else if(Method.isMethodable(method)) {
            if(this.methods instanceof Set) {
                this.methods.add(new Method(method));
            } else if(this.methods instanceof Map && name) {
                this.methods.set(name, new Method(method));
            }
        }

        return this;
    }
    retire(nameOrIndex) {
        this.methods.delete(nameOrIndex);

        return this;
    }

    perform(...args) {
        return this.role.perform(...args);
    }

    static FromVisions(...visions) {
        const methods = [];

        for(let vision of visions) {
            if(Method.isMethodable(vision)) {
                methods.push(new Method(vision));
            }
        }

        return new Character(...methods);
    }
};