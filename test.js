const ReflectExt = require('.');
const assert = require('assert');

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

var michael, methods, fields, props, firstAge;

michael = new Person('Michael', 46);
try {
    assert((methods = ReflectExt.getOwnMethodDescriptors(michael)).length === 1, 'getOwnMethodDescritpors returning incorrect number of methods');
    assert((fields = ReflectExt.getOwnFieldDescriptors(michael)).length === 2, 'getOwnFieldDescriptors returning incorrect number of fields');
    assert((props = ReflectExt.getOwnPropertyDescriptors(michael)).length === 1, 'getOwnPropertyDescriptors returning incorrect number of properties');

    firstAge = michael.age;
    methods[0].value.call(michael); // calls the doBirthday method

    assert(firstAge === michael.age - 1, 'method descriptor not being called on target correctly');


    assert(props[0].getter.value.call(michael) === michael.birthYear, 'property getter method descriptor not being called on target correctly'); // calls the getter for the birthYear property
    assert(fields[0].value === michael.name, 'field descriptor does not contain the correct value'); // reads the name field value
} catch (error) {
    console.error(error.message);
    process.exit(-1);
}
console.log('Tests passed');
process.exit(0);