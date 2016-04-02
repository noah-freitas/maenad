import mainDb from 'lib/db-main.js';

let dbs = {
    [mainDb.name] : mainDb
};

export default {
    getAllFromStore,
    getCursor,
    getDb,
    getObjectStore
};

// getFromStore :: String, String -> Promise<a>
function getFromStore(store, key) {
    return getObjectStore(store, 'readonly')
            .then(os => idbRequestToPromise(os, 'get', [key]));
}

// getAllFromStore :: IDBObjectStore -> Promise<[a]>
function getAllFromStore(store) {
    return idbRequestToPromise(store, 'getAll');
}

// getCursor :: IDBObjectStore, (Event -> undefined) -> Promise<IDBCursorWithValue>
function getCursor(objectStore, cb) {
    return idbRequestToPromise(objectStore, 'openCursor', [], { successCallBack : cb });
}

// getDb :: String, Number -> Promise<IDBDatabase>
function getDb(name = mainDb.name, version = mainDb.version) {
    return idbRequestToPromise(window.indexedDB, 'open', [name, version], {
        events : {
            upgradeneeded : performUpgrades
        }
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

// idbRequestToPromise :: IDBObjectStore, String, [a], OverridesOpts -> Promise<IDBRequestResult>
// OverridesOpts :: { successCallBack :: (Event -> undefined), errorCallBack :: (Event -> undefined) }
function idbRequestToPromise(obj, method, args = [], overrides = {}) {
    return new Promise((res, rej) => {
        let req = obj[method].apply(obj, args);

        req.addEventListener('success', overrides.successCallBack || res);
        req.addEventListener('error'  , overrides.errorCallBack   || rej);

        if (overrides.events) Object.keys(overrides.events).forEach(eName => {
            req.addEventListener(eName, overrides.events[eName]);
        });
    }).then(e => e.target.result);
}
