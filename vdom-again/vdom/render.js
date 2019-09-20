const renderElem = ({ tagName, attrs, children }) => {
    const $el = document.createElement(tagName);

    // set attributes
    for (const [k, v] of Object.entries(attrs)) {
        if (k.startsWith("on")) {
            const event = k.substr(2);
            const handler = v.bind($el);
            $el.addEventListener(event, handler);
        } else if (k === "style") {
            Object.assign($el.style, v); // v is an object! v is not a string!
        } else if (k === "$class") {
            $el.setAttribute('class', $el[k]);
        } else if (k === "$for") {
            $el.setAttribute('for', $el[k]);
        } else if (k === "ref") {
            v($el); // v is a function which modifies the $el refrence
        } else {
            $el.setAttribute(k, v);
        }
    }

    // set children
    for (const child of children) {
        const $child = render(child);
        $el.appendChild($child);
    }

    return $el;
};

const render = (vNode) => {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode);
    }

    return renderElem(vNode);
}


export default render;
