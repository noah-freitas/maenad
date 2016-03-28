import db from 'lib/db.js';

export default {
    addFiles,
    getFirstSong
};

// addFiles :: [File] -> Promise<undefined>
function addFiles(files) {
    return db.getObjectStore('file', 'readwrite')
             .then(writeFiles);

    // writeFiles :: IDBObjectStore -> undefined
    function writeFiles(fileStore) {
        files.forEach(file => fileStore.add({
            file,
            lastModifiedDate : file.lastModifiedDate.getTime(),
            name             : file.name,
            size             : file.size,
            type             : file.type
        }));
    }
}

// getFirstSong :: undefined -> Promise<Song || null>
function getFirstSong() {
    return new Promise((res, rej) => {
        db.getObjectStore('file', 'readonly')
          .then(objStore => db.getCursor(objStore, e => res(e.target.result && e.target.result.value)))
          .catch(rej);
    });
}
