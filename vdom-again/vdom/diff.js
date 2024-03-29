import render from './render';

const zip = (xs, ys) => {
    const zipped = [];
    for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]]);
    }
    return zipped;
};

const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = [];

    // set new attributes
    for (const [k, v] of Object.entries(newAttrs)) {
        patches.push($node => {
            if (k.startsWith("on")) {
                const event = k.substring(2);
                const handler = v.bind($node);
                $node.addEventListener(event, handler);
            } else if (k === "style" && typeof v === 'object') {
                Object.assign($node.style, v); // v is an object! v is not a string!
            } else if (k === "$class") {
                $node.setAttribute('class', $node[k]);
            } else if (k === "$for") {
                $node.setAttribute('for', $node[k]);
            } else if (k === "ref") {
                v($node); // v is a function which modifies the $el refrence
            } else {
                $node.setAttribute(k, v);
            }
            
            return $node;
        });
    }

    // remove old attributes
    for (const k in oldAttrs) {
        if (!(k in newAttrs)) {
            patches.push($node => {
                if (k.startsWith("on")) {
                    const event = k.substring(2);
                    $node.removeEventListener(event, oldAttrs[k]);
                } else if (k === "$class") {
                    $node.removeAttribute('class');
                } else if (k === "$for") {
                    $node.removeAttribute('for');
                } else { 
                    $node.removeAttribute(k);
                }

                return $node;
            });
        }
    }

    return $node => {
        for (const patch of patches) {
            patch($node);
        }
    };
};

const diffChildren = (oldVChildren, newVChildren) => {
    const childPatches = [];
    oldVChildren.forEach((oldVChild, i) => {
        childPatches.push(diff(oldVChild, newVChildren[i]));
    });

    const additionalPatches = [];
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
        additionalPatches.push($node => {
            $node.appendChild(render(additionalVChild));
            return $node;
        });
    }

    return $parent => {
        for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
            patch(child);
        }

        for (const patch of additionalPatches) {
            patch($parent);
        }

        return $parent;
    };
};

const diff = (vOldNode, vNewNode) => {
    if (vNewNode === undefined) {
        return $node => {
            $node.remove();
            return undefined;
        };
    }

    if (typeof vOldNode === 'string' || typeof vNewNode === 'string') {
        if (vOldNode !== vNewNode) {
            return $node => {
                const $newNode = render(vNewNode);
                $node.replaceWith($newNode);
                return $newNode;
            };
        } else {
            return $node => undefined;
        }
    }

    if (vOldNode.tagName !== vNewNode.tagName) {
        return $node => {
            const $newNode = render(vNewNode);
            $node.replaceWith($newNode);
            return $newNode;
        };
    }

    const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

    return $node => {
        patchAttrs($node);
        patchChildren($node);
        return $node;
    };
};

export default diff;