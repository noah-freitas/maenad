import mainDb from 'lib/db-main.js';

let dbs = {
    [mainDb.name] : mainDb
};

export default {
    getCursor,
    getDb,
    getObjectStore
};

// getCursor :: IDBObjectStore, (Event -> undefined) -> Promise<IDBCursorWithValue>
function getCursor(objectStore, cb) {
    return new Promise((res, rej) => {
        let req = objectStore.openCursor();
        req.addEventListener('success', cb)
    });
}

// getDb :: String, Number -> Promise<IDBDatabase>
function getDb(name = mainDb.name, version = mainDb.version) {
    return new Promise((res, rej) => {
        let req = indexedDB.open(name, version);

        req.addEventListener('error'         , (e => rej(new Error(`Database error: ${ e.target.errorCode }`))));
        req.addEventListener('success'       , (e => res(e.target.result)));
        req.addEventListener('upgradeneeded' , performUpgrades);
    });

    // performUpgrades :: IDBVersionChangeEvent -> undefined
    function performUpgrades(e) {
        let dbDef    = dbs[name],
            upgrades = dbDef.upgrades.slice(e.oldVersion || 0, e.newVersion);

        upgrades.forEach(u => u(e));
    }
}

// getObjectStore :: String, String, String?, String? -> Promise<IDBObjectStore>
function getObjectStore(storeName, permission, dbName, dbVersion) {
    return getDb.apply(null, Array.from(arguments).slice(2))
                .then(db => db.transaction(storeName, permission).objectStore(storeName));
}
