# reflect-js
Extended reflection for Node JS

## About
Reflect-js expands on the [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) object
to provide additional capability.

## API
In addition to the API provided by Reflect, Reflect-js provides:
* [getOwnConstructorDescriptor(target: object) => MethodDescriptor](#getownconstructordescriptor)
* [getOwnDescriptor(target: object, name: string) => Descripitor](#getowndescriptor)
* [getOwnDescriptors(target: object, methods?: boolean) => Array<Descriptor>](#getowndescriptors)
* [getOwnFieldDescriptors(target: object) => Array<FieldDescriptor>](#getownfielddescriptors)
* [getOwnKeys(target: object, methods?: boolean) => Array<string>](#getownkeys)
* [getOwnMethodDescriptors(target: object) => Array<MethodDescriptor>](#getownmethoddescriptors)
* [getOwnPropertyDescriptors(target: object) => Array<PropertyDescriptor>](#getownpropertydescriptors)

### Classes
Most Reflect-js methods return instances of the Descriptor interface:
~~~~
Descriptor {
    configurable: boolean,
    enumerable: boolean,
    name: string,
    value: any,
    writable: boolean
}
~~~~

The FieldDescriptor, MethodDescriptor and PropertyDescriptor classes implement the Descriptor interface. 

~~~~
FieldDescriptor {
    configurable: boolean,
    enumerable: boolean,
    name: string,
    value: any,
    writable: boolean
}
~~~~

~~~~
MethodDescriptor {
    arguments: Array<string>,
    configurable: boolean,
    enumerable: boolean,
    name: string,
    value: function,
    writable: boolean
}
~~~~

~~~~
PropertyDescriptor {
    configurable: boolean,
    enumerable: boolean,
    getter: MethodDescriptor | null,
    name: string,
    readable: boolean,
    setter: MethodDescriptor | null,
    value: any,
    writable: boolean
}
~~~~
### getOwnConstructorDescriptor
```getOwnConstructorDescriptor(target: object) => MethodDescriptor```

Gets the MethodDescriptor for the constructor.

Usage:
~~~~
const ReflectExt = require('reflect-js');
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    get birthYear() {
        return new Date.getUTCFullYear() - this.age;
    }
}
var michael = new Person('Michael', 46);
ReflectExt.getOwnConstructorDescriptor(michael);
/*
MethodDescriptor {
  enumerable: false,
  configurable: true,
  writable: true,
  value: [Function: Person],
  name: 'constructor',
  arguments: [ 'name', 'age' ] }
*/
~~~~

### getOwnDescriptor
```getOwnDescriptor(target: object, name: string) => Descripitor```

Gets a Descriptor object for the requested field, property or method of the target, or null if the name is not a member of the target.

Usage:
~~~~
const ReflectExt = require('reflect-js');
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    get birthYear() {
        return new Date.getUTCFullYear() - this.age;
    }
}
var michael = new Person('Michael', 46);
ReflectExt.getOwnDescriptor(michael, 'birthYear');
/*
PropertyDescriptor {
  enumerable: false,
  configurable: true,
  writable: false,
  value: undefined,
  name: 'birthYear',
  readable: true,
  getter:
   MethodDescriptor {
     enumerable: false,
     configurable: true,
     writable: false,
     value: [Function: get birthYear],
     name: 'get birthYear',
     arguments: [] },
  setter: null }
*/
~~~~

### getOwnDescriptors 
```getOwnDescriptors(target: object, methods?: boolean) => Array<Descriptor>```

Gets all the Descriptors for the target object. If methods is false, just gets the fields.

Usage:
~~~~
const ReflectExt = require('reflect-js');
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    get birthYear() {
        return new Date.getUTCFullYear() - this.age;
    }
}
var michael = new Person('Michael', 46);
ReflectExt.getOwnDescriptors(michael);
/*
[ FieldDescriptor {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'Michael',
    name: 'name' },
  FieldDescriptor {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 46,
    name: 'age' },
  MethodDescriptor {
    enumerable: false,
    configurable: true,
    writable: true,
    value: [Function: Person],
    name: 'constructor',
    arguments: [ 'name', 'age' ] },
  PropertyDescriptor {
    enumerable: false,
    configurable: true,
    writable: false,
    value: undefined,
    name: 'birthYear',
    readable: true,
    getter:
     MethodDescriptor {
       enumerable: false,
       configurable: true,
       writable: false,
       value: [Function: get birthYear],
       name: 'get birthYear',
       arguments: [] },
    setter: null } ]
*/
~~~~

### getOwnFieldDescriptors
```getOwnFieldDescriptors(target: object) => Array<FieldDescriptor>```

Gets the FieldDescriptors of the target. It is implemented as:
```getOwnDescriptors(target).filter(descriptor => descriptor instanceof FieldDescriptor)```

See [getOwnDescriptors](#getOwnDescriptors) for usage.

### getOwnKeys
```getOwnKeys(target: object, methods?: boolean) => Array<string>```

Gets field names, property names and method names. If methods is missing or 
true, inspects the constructor prototype (the class).

Usage:
~~~~
const ReflectExt = require('reflect-js');
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    get birthYear() {
        return new Date.getUTCFullYear() - this.age;
    }
}
var michael = new Person('Michael', 46);
ReflectExt.getOwnKeys(michael); // => ['name', 'age', 'constructor', 'birthYear']
~~~~

### getOwnMethodDescriptors
```getOwnMethodDescriptors(target: object) => Array<MethodDescriptor>```

Gets the MethodDescriptors of the target. It is implemented as:
```getOwnDescriptors(target).filter(descriptor => descriptor instanceof MethodDescriptor && descriptor.name !== 'constructor')```

See [getOwnDescriptors](#getOwnDescriptors) for usage.


### getOwnPropertyDescriptors
```getOwnPropertyDescriptors(target: object) => Array<PropertyDescriptor>```

Gets the PropertyDescriptors of the target. It is implemented as:
```getOwnDescriptors(target).filter(descriptor => descriptor instanceof PropertyDescriptor)```

See [getOwnDescriptors](#getOwnDescriptors) for usage.