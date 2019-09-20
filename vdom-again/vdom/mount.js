export default ($node, $target) => {
    if (typeof $target === "string") {
        let $targetEl = document.querySelector($target);
        $targetEl.replaceWith($node);
    } else {
        $target.replaceWith($node);
    }
    return $node;
};
