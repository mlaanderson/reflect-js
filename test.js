const ReflectExt = require('.');

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    get birthYear() {
        return new Date().getUTCFullYear() - this.age;
    }

    doBirthday() {
        this.age++;
    }
}

var michael = new Person('Michael', 46);

var methods = ReflectExt.getOwnMethodDescriptors(michael);
var fields = ReflectExt.getOwnFieldDescriptors(michael);
var props = ReflectExt.getOwnPropertyDescriptors(michael);

console.log(michael);

methods[0].value.call(michael); // calls the doBirthday method

console.log(michael);

console.log(props[0].getter.value.call(michael)); // calls the getter for the birthYear property
console.log(fields[0].value); // reads the name field value