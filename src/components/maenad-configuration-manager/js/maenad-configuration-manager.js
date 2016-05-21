import config     from 'lib/config.js';
import registerEl from 'lib/register-element.js';

export default registerEl('maenad-configuration-manager', {
    createdCallback
});

// createdCallback :: undefined -> undefined
function createdCallback() {
    showConfigs.call(this, config);

    let button         = document.createElement('button');
    button.textContent = 'Save';
    button.addEventListener('click', saveConfigs.bind(this));
    this.appendChild(button);
}

// saveConfigs :: undefined -> undefined
function saveConfigs() {
    let configs = mergeObjects(
        Array.from(this.children)
             .filter(el => el.matches('fieldset, label'))
             .map(nodeToTuple)
    );

    localStorage.config = JSON.stringify(configs);

    // nodeToTuple :: Element -> Object
    function nodeToTuple(el) {
        let elName = el.tagName.toLowerCase(),
            label,
            val;

        switch (true) {
            case elName === 'fieldset' :
                label = el.querySelector('legend').textContent;
                val   = mergeObjects(Array.from(el.querySelectorAll('label')).map(nodeToTuple));
                break;
            case Boolean(elName === 'label' && el.querySelector('input[type="text"]')) :
                label = el.querySelector('span').textContent;
                val   = el.querySelector('input').value;
                break;
            case Boolean(elName === 'label' && el.querySelector('input[type="checkbox"]')) :
                label = el.querySelector('span').textContent;
                val   = el.querySelector('input').checked;
                break;
        }

        return { [label] : val };
    }

    // mergeObjects :: [Object] -> Object
    function mergeObjects(args) {
        return Object.assign({}, ...args);
    }
}

// showConfigs :: Object -> undefined
function showConfigs(configs) {
    Object.keys(configs)
          .map(makeConfigEl.bind(null, configs))
          .forEach(el => this.appendChild(el));

    // makeConfigEl :: Object, String -> Element
    function makeConfigEl(configs, key) {
        switch (typeof configs[key]) {
            case 'object' : return makeFieldSet(key, configs[key]);
            default       : return makeValueEl(key, configs[key]);
        }
    }

    // makeFieldSet :: String, Object -> Element
    function makeFieldSet(key, value) {
        let fieldset = document.createElement('fieldset'),
            legend   = document.createElement('legend');

        legend.appendChild(document.createTextNode(key));
        fieldset.appendChild(legend);
        Object.keys(value).forEach(subKey => fieldset.appendChild(makeConfigEl(value, subKey)));
        return fieldset;
    }

    // makeValueEl :: String, a -> Element
    function makeValueEl(key, value) {
        let label = document.createElement('label'),
            input = document.createElement('input'),
            span  = document.createElement('span');

        switch (typeof value) {
            case 'boolean' :
                input.type    = 'checkbox';
                input.checked = value;
                break;
            case 'string' :
                input.type  = 'text';
                input.value = value;
                break;
            default :
                throw new TypeError(`Can\'t create editor for ${ key }: ${ value }`);
        }

        span.appendChild(document.createTextNode(key));
        label.appendChild(span);
        label.appendChild(input);
        return label;
    }
}
