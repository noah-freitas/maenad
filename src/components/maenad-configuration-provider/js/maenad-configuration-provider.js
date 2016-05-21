import registerEl from 'lib/register-element.js';

export default registerEl('maenad-configuration-provider', {
    createdCallback
});

// createdCallback :: undefined -> undefined
function createdCallback() {
    let config = JSON.parse(localStorage.config);

    Object.keys(config)
          .forEach(key => Object.defineProperty(this, key, { get : () => config[key] }));
}
