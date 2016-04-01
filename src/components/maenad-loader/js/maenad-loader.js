import data       from 'lib/data.js';
import registerEl from 'lib/register-element.js';
import templateFn from './template.js';

export default registerEl('maenad-loader', {
    createdCallback,
    load
});

// createdCallback :: undefined -> undefined
function createdCallback() {
    this.appendChild(templateFn());

    this.querySelector('input[type="file"]')
        .addEventListener('change', e => this.load(Array.from(e.target.files)));
}

// load :: [File] -> Promise<undefined>
function load(files) {
    if (!Array.isArray(files) || files.some(arentFiles))
        return Promise.reject(new TypeError('<maenad-loader>.load expects an array of files as input.'));

    this.dispatchEvent(makeFileEvent('maenad:loading-files'));

    return addFiles().then(
        () => { this.dispatchEvent(makeFileEvent('maenad:done-loading-files')); },
        er => { this.dispatchEvent(makeFileEvent('maenad:error-loading-files', { error : er })); }
    );

    // addFiles :: undefined -> Promise<undefined>
    function addFiles() {
        return files.length > 0 ? data.addFiles(files) : Promise.resolve(undefined);
    }

    // arentFiles :: a -> Boolean
    function arentFiles(f) {
        return !(f instanceof File);
    }

    // makeFileEvent :: String, Object -> CustomEvent<{ files :: [File] }>
    function makeFileEvent(name, additionalDetails = {}) {
        return new CustomEvent(name, {
            bubles : true,
            detail : Object.assign({
                files : files.slice(0)
            }, additionalDetails)
        });
    }
}
