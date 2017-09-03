const ReflectExt = require('.');

var wm = new WeakMap();

class Person {
    constructor(name, birthday) {
        this.name = name || 'No Name';
        this.birthday = birthday || new Date(Date.now());

        if (typeof this.birthday === 'string') {
            this.birthday = new Date(Date.parse(this.birthday));
        }
        wm.set(this, 'TEST');

        Object.seal(this);
    }

    get age() {
        let now = new Date();
        let yearDiff = now.getUTCFullYear() - this.birthday.getUTCFullYear();
        if ((now.getUTCMonth() < this.birthday.getUTCMonth()) || ((now.getUTCMonth() == this.birthday.getUTCMonth()) && (now.getUTCDate() < this.birthday.getUTCDate()))) {
            yearDiff--;
        }

        return yearDiff;
    }

    get test() {
        return wm.get(this);
    }

    set test(value) {
        wm.set(this, value);
    }

    toString(a) {
        return `${this.name} is ${this.age} years old`;
    }
}

var michael = new Person('Michael Anderson', '1973-09-27');

console.log(ReflectExt.getOwnDescriptors(michael));