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

// getAllFromStore :: IDBObjectStore -> Promise<[a]>
function getAllFromStore(store) {
    return idbRequestToPromise(store, 'getAll');
}

// getCursor :: (Error, Event -> undefined), IDBObjectStore -> undefined
function getCursor(cb, objectStore) {
    let req = objectStore.openCursor();

    req.addEventListener('success', e => cb(null, e));
    req.addEventListener('error'  , e => cb(e));
}

// getDb :: (Error, IDBDatabase -> undefined), String, Number -> undefined
function getDb(cb, name = mainDb.name, version = mainDb.version) {
    let req = window.indexedDB.open(name, version);

    req.addEventListener('success'       , e => cb(null, e.target.result));
    req.addEventListener('error'         , e => cb(e));
    req.addEventListener('upgradeneeded' , performUpgrades);

    // performUpgrades :: IDBVersionChangeEvent -> undefined
    function performUpgrades(e) {
        let dbDef    = dbs[name],
            upgrades = dbDef.upgrades.slice(e.oldVersion || 0, e.newVersion);

        upgrades.forEach(u => u(e));
    }
}

// getObjectStore :: (Error, IDBObjectStore -> undefined), String, String, String?, String? -> undefined
function getObjectStore(cb, storeName, permission, dbName, dbVersion) {
    getDb(getStoreFromDbAndCallCb, dbName, dbVersion);

    // getStoreFromDbAndCallCb :: Error, IDBDatabase -> undefined
    function getStoreFromDbAndCallCb(err, db) {
        if (err) return cb(err);
        cb(null, db.transaction(storeName, permission).objectStore(storeName))
    }
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
