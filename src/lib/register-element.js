export default registerEl;

// registerEl :: String, { * :: Function }, ElementPrototype -> (undefined -> Element)
function registerEl(name, methods, baseClass) {
    return document.registerElement(name, {
        prototype : Object.assign(Object.create(baseClass || HTMLElement.prototype), methods)
    });
}
