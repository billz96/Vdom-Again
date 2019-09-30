function isEmpty(arg) {
    return typeof arg === "undefined" || arg === null;
}

function isArg(typeName) {
    return (arg, prop) => typeof arg === typeName || new Error(`type of '${prop}' is '${typeof arg}' instead of '${typeName}'`);
}

const PropTypes = {
    symbol: isArg("symbol"),
    string: isArg("string"),
    number: isArg("number"),
    bigint: isArg("bigint"),
    boolean: isArg("boolean"),
    function: isArg("function"),
    object: isArg("object")
};

PropTypes.either = (typeA, typeB) => {
    return (arg, prop) => {
        let val1 = PropTypes[typeA](arg);
        let val2 = PropTypes[typeB](arg);

        let res1 = typeof val1 === 'boolean';
        let res2 = typeof val2 === 'boolean';

        if (res1 || res2) {
            return true;
        } else {
            return new Error(`type of '${prop}' is neither '${typeA}' or '${typeB}' but '${typeof arg}'`);
        }
    };
}

PropTypes.optional = (typeName) => {
    return (arg, prop) => {
        return isEmpty(arg) || typeof arg === typeName ? true : new Error(`type of '${prop}' is neither 'nil' or '${typeName}' but '${typeof arg}'`);
    };
}

PropTypes.list = () => {
    return (arg, prop) => {
        return Array.isArray(arg) ? true : new Error(`type of '${prop}' is '${typeof arg}' instead of list`);
    };
}

PropTypes.listOf = (typeName) => {
    return (arg, prop) => {
        if (!Array.isArray(arg)) return new Error(`type of '${prop}' is '${typeof arg}' instead of a list of '${typeName}s'`);
        return arg.every(el => typeof el === typeName) ? true : new Error(`not every element of the list of '${prop}' is of type '${typeName}'`);;
    };
}

export { PropTypes };