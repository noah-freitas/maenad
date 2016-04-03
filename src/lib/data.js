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
                  .then(getObjectStoreAndSaveSongs);

    // getObjectStoreAndSaveSongs :: [Song] -> Promise<undefined>
    function getObjectStoreAndSaveSongs(songs) {
        return new Promise((res, rej) => {
            db.getObjectStore((err, os) => {
                if (err) return rej(err);

                let trans = os.transaction;
                trans.addEventListener('complete', () => res());
                trans.addEventListener('error'   , rej);

                songs.forEach((song, i) => os.add(Object.assign(song, { file : files[i] })));
            }, 'song', 'readwrite');
        });
    }
}

// songFileToPromise :: Song -> Song
function songFileToPromise(song) {
    return song && Object.assign({}, song, { file : Promise.resolve(song.file) });
}

// getAllSongs :: undefined -> Promise<[Song]>
function getAllSongs() {
    return new Promise((res, rej) => {
        db.getObjectStore((err, os) => {
            if (err) return rej(err);

            db.getAllFromStore(os)
              .then(songs => songs.map(songFileToPromise))
              .then(res, rej);
        }, 'song', 'readonly');
    });
}

// getFirstSong :: undefined -> Promise<Song || null>
function getFirstSong() {
    return new Promise((res, rej) => {
        db.getObjectStore((err, os) => {
            if (err) return rej(err);

            db.getCursor((err, e) => {
                if (err) return rej(err);

                res(e.target.result && e.target.result.value);
            }, os);
        }, 'song', 'readonly');
    }).then(songFileToPromise);
}
