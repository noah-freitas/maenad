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

    // saveSongs :: [IDBObjectStore, [Song]] -> undefined
    function saveSongs([songStore, songs]) {
        songs.forEach(song => songStore.add(song));
    }
}

// getAllSongs :: undefined -> Promise<[Song]>
function getAllSongs() {
    return db.getObjectStore('song', 'readonly')
             .then(db.getAllFromStore);
}

// getFirstSong :: undefined -> Promise<Song || null>
function getFirstSong() {
    return new Promise((res, rej) => {
        db.getObjectStore('song', 'readonly')
          .then(objStore => db.getCursor(objStore, e => res(e.target.result && e.target.result.value)))
          .catch(rej);
    });
}
