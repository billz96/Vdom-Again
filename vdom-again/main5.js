import { h } from "./vdom/h";
import render from './vdom/render';
import mount from './vdom/mount';
import diff from './vdom/diff';
import { PropTypes } from './vdom/propTypes';

const createVApp = (props) =>
    h('div', { id: 'app', dataCount: props.count }, [
        h('input'),
        `${props.count}`,
        ...Array.from(
            { length: props.count },
            () => h('img', { src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif' })
        )
    ]
    );

createVApp.propTypes = {
    count: PropTypes.number // or: PropTypes.either("number", "string")
};

createVApp.defaultProps = {
    count: 0
};

let count = 0;
let vApp = h(createVApp, { count: count });
const $app = render(vApp);

let $rootEl = mount($app, "#app");

setInterval(() => {
    const vNewApp = h(createVApp, { count: Math.floor(Math.random() * 10) });
    const patch = diff(vApp, vNewApp);
    $rootEl = patch($rootEl);
    vApp = vNewApp;
}, 1000);

// line 33 is the same with:
// const vNewApp = <createVApp count={Math.floor(Math.random() * 10)} />;