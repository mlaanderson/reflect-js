
class Descriptor {
    constructor(name, object) {
        this.enumerable = !!object.enumerable;
        this.configurable = !!object.configurable;
        this.writable = !!object.writable;
        this.value = object.value;
        this.name = name;
    }
}

class FieldDescriptor extends Descriptor {
    constructor(name, object) {
        super(name, object);
    }
}

class PropertyDescriptor extends Descriptor {
    constructor(name, object) {
        super(name, object);

        this.readable = !!object.readable;

        if (object.get !== undefined) {
            this.getter = new MethodDescriptor(name, object, true);
            this.readable = true;
        } else {
            this.getter = null;
        }
        if (object.set !== undefined) {
            this.setter = new MethodDescriptor(name, object, false, true);
            this.writable = true;
        } else {
            this.setter = null;
        }
    }
}

class MethodDescriptor extends Descriptor {
    constructor(name, object, isGetter = false, isSetter = false) {
        super(name, object);
        if (isGetter) {
            this.name = `get ${name}`;
            this.value = object.get;
        } else if (isSetter) {
            this.name = `set ${name}`;
            this.value = object.set;
        } else {
            this.name = name;
            this.value = object.value;
        }

        let re;
        if (this.value.toString().startsWith('class')) {
            re = /constructor\(([^\)]*)\)/;
        } else {
            re = new RegExp(`^(?:(?:${this.name})|(?:function(?:\\s*${this.name})?))\\s*\\(([^\\(]*)\\)`);
        }
        let args = re.exec(this.value.toString() || '');
        this.arguments = args && args.length > 1 && args[1] !== undefined ? args[1].split(',').map(arg => arg.trim()) : [];
        if (this.arguments.length === 1 && this.arguments[0] === '') this.arguments = [];
    }
}

var ReflectEx = {
    /**
     * Gets an expanded descriptor from the target object. Returns null if
     * the target does not have the requested property.
     * 
     * @param {object} target - the object to inspect
     * @param {string} name - the property name to retrieve
     * @returns {Descriptor}
     */
    getOwnDescriptor: function(target, name) {
        let base;
        if (ReflectEx.ownKeys(target).indexOf(name) >= 0) {
            base = ReflectEx.getOwnPropertyDescriptor(target, name);
        } else if (ReflectEx.has(target.constructor.prototype, name)) {
            base = ReflectEx.getOwnPropertyDescriptor(target.constructor.prototype, name);
        } else {
            return null;
        }

        switch(typeof base['value']) {
            case 'function':
                return new MethodDescriptor(name, base);
            case 'undefined':
                return new PropertyDescriptor(name, base);
            default:
                return new FieldDescriptor(name, base);
        }
    },

    /**
     * Expands on Reflect.ownKeys. Can include the constructor and method names as well.
     * 
     * @param {object} target - The object to inspect
     * @param {boolean} [methods] - If true or omitted, includes the constructor and method names.
     * @returns {Array<string>}
     */
    getOwnKeys: function(target, methods = true) {
        let result = ReflectEx.ownKeys(target);

        if (methods) {
            let ownMethods = ReflectEx.ownKeys(target.constructor.prototype);
            result = result.concat(ownMethods);
        }

        return result;
    },

    /**
     * Gets the descriptors for the target object. Can include the constructor and methods as well
     * 
     * @param {object} target - the object to inspect
     * @param {boolean} [methods] - If true or omitted, includes the constructor and method names.
     * @returns {Array<Descriptor>}
     */
    getOwnDescriptors: function(target, methods = true) {
        let keys = ReflectEx.getOwnKeys(target, methods);
        return keys.map(key => ReflectEx.getOwnDescriptor(target, key));
    },

    /**
     * Gets the method descriptors for the target object
     * 
     * @param {object} target - the object to inspect
     * @returns {Array<MethodDescriptor>}
     */
    getOwnMethodDescriptors: function(target) {
        return ReflectEx.getOwnDescriptors(target).filter(desc => desc instanceof MethodDescriptor && desc.name !== 'constructor');
    },

    /**
     * Gets the property descriptors for the target object
     * 
     * @param {object} target - the object to inspect
     * @returns {Array<PropertyDescriptor>}
     */
    getOwnPropertyDescriptors: function(target) {
        return ReflectEx.getOwnDescriptors(target).filter(desc => desc instanceof PropertyDescriptor);
    },

    /**
     * Gets the field descriptors for the target object
     * 
     * @param {object} target - the object to inspect
     * @returns {Array<FieldDescriptor>}
     */
    getOwnFieldDescriptors: function(target) {
        return ReflectEx.getOwnDescriptors(target).filter(desc => desc instanceof FieldDescriptor);
    },

    /**
     * Gets the constructor descriptor for the target object
     * 
     * @param {object} target - the object to inspect
     * @returns {MethodDescriptor}
     */
    getOwnConstructorDescriptor: function(target) {
        let result = ReflectEx.getOwnDescriptors(target).filter(desc => desc instanceof MethodDescriptor && desc.name === 'constructor');
        if (result.length > 0) return result[0];
        return null;
    }
};

for (let key of Reflect.ownKeys(Reflect)) {
    ReflectEx[key] = Reflect[key];
}

module.exports = ReflectEx;