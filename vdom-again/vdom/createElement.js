export default (tagName, { attrs = {}, children = [] } = {}) => {
    if (typeof tagName === 'function') {

        if (tagName.propTypes) {
            let props = tagName.propTypes;
            let propNames = Object.keys(attrs);

            let vals = propNames.map(propName => {
                if (tagName.defaultProps && tagName.defaultProps[propName]) {
                    // is prop undefined? use default prop if exists
                    if (typeof attrs[propName] === 'undefined' || attrs[propName] === null) {
                        attrs[propName] = tagName.defaultProps[propName];
                    }
                    // validate prop
                    return props[propName](attrs[propName], `${tagName.name}:${propName}`);
                } else {
                    // validate prop
                    return props[propName](attrs[propName], `${tagName.name}:${propName}`); 
                }
            });

            // successful validation
            if (vals.every(val => typeof val === 'boolean')) {
                return tagName({ ...attrs, children }); // props = {...attrs, children}
            } else {
                // validation failed
                let errs = vals.filter(val => typeof val !== 'boolean');
                let msgs = errs.map(err => err.message).join(',\n');
                throw new Error(msgs);
            }
        }
        
        return tagName({ ...attrs, children }); // props = {...attrs, children}
    }
    
    return {
        tagName,
        attrs,
        children,
    };
};