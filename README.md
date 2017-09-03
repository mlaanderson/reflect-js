# reflect-js
Extended reflection for Node JS

## About
Reflect-js expands on the [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) object
to provide additional capability.

## API
In addition to the API provided by Reflect, Reflect-js provides:

#### getOwnKeys(target: any, methods?: boolean)
Gets field names, property names and method names. If methods is missing or 
true, inspects the constructor prototype (the class).

Usage:
~~~~
const ReflectExt = require('reflect-js');

var michael = new Person('Michael', 46);

ReflectExt.getOwnKeys(michael); // => ['name', 'age', 'constructor']
~~~~