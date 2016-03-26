import db         from 'lib/db.js';
import registerEl from 'lib/register-element.js';
import templateFn from './template.js';

export default registerEl('maenad-loader', {
    createdCallback,
    load
});

// createdCallback :: undefined -> undefined
function createdCallback() {
    this.appendChild(templateFn());

    this.querySelector('input[type="file"]').addEventListener('change', e => {
        this.load(Array.from(e.target.files));
    })
}

// load :: [File] -> Promise<undefined>
function load(files) {
    if (!Array.isArray(files) || files.some(arentFiles))
        return Promise.reject(new TypeError('<maenad-loader>.load expects an array of files as input.'));

    return files.length > 0 ? writeFilesToDb(files) : Promise.resolve(undefined);

    // arentFiles :: a -> Boolean
    function arentFiles(f) {
        return !(f instanceof File);
    }
}

// writeFilesToDb :: [File] -> Promise<undefined>
function writeFilesToDb(files) {
    return db.getObjectStore('file', 'readwrite')
             .then(writeFiles);

    // writeFiles :: IDBObjectStore -> undefined
    function writeFiles(fileStore) {
        files.forEach(f => fileStore.add(f));
    }
}
