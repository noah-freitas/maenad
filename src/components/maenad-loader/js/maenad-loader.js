import registerEl from 'lib/register-element.js';

export default registerEl('maenad-loader', {
    load
});

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
    return getDb().then(getFilesObjectStore)
                  .then(writeFiles)
                  .then(() => undefined)

}
