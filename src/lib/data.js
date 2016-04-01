import db   from 'lib/db.js';
import Song from 'lib/song.js';

export default {
    addFiles,
    getAllSongs,
    getFirstSong
};

// addFiles :: [File] -> Promise<undefined>
function addFiles(files) {
    return Promise.all(files.map(Song))
                  .then(getObjectStore)
                  .then(saveSongs);

    // getObjectStore :: [Song] -> Promise<[IDBObjectStore, [Song]]>
    function getObjectStore(songs) {
        return Promise.all([db.getObjectStore('song', 'readwrite'), songs]);
    }

    // saveSongs :: [IDBObjectStore, [Song]] -> Promise<undefined>
    function saveSongs([songStore, songs]) {
        return new Promise((res, rej) => {
            let trans = songStore.transaction;
            trans.addEventListener('complete', () => res());
            trans.addEventListener('error'   , rej);

            songs.forEach(song =>
                song.file.then(file =>
                    songStore.add(Object.assign(song, { file }))
                )
            );
        });
    }
}

// songFileToPromise :: Song -> Song
function songFileToPromise(song) {
    return song && Object.assign({}, song, { file : Promise.resolve(song.file) });
}

// getAllSongs :: undefined -> Promise<[Song]>
function getAllSongs() {
    return db.getObjectStore('song', 'readonly')
             .then(db.getAllFromStore)
             .then(songs => songs.map(songFileToPromise));
}

// getFirstSong :: undefined -> Promise<Song || null>
function getFirstSong() {
    return new Promise((res, rej) => {
        db.getObjectStore('song', 'readonly')
          .then(objStore => db.getCursor(objStore, e => res(e.target.result && e.target.result.value)))
          .catch(rej);
    }).then(songFileToPromise);
}
