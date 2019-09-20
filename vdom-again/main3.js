import { hh } from "./vdom/h";
import render from "./vdom/render";
import mount from "./vdom/mount";
import diff from "./vdom/diff";

const {div, input, img} = hh;

const createVApp = count =>
    div({ id: "app", dataCount: count }, [
            input(),
            `${count}`,
            ...Array.from(
                { length: count },
                () => img({ src: "https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif" })
            )
        ]
    );

let count = 0;
let vApp = createVApp(count);
const $app = render(vApp);

let $rootEl = mount($app, "#app");

setInterval(() => {
    const vNewApp = createVApp(Math.floor(Math.random() * 10));
    const patch = diff(vApp, vNewApp);
    $rootEl = patch($rootEl);
    vApp = vNewApp;
}, 1000);
