import mainDb from 'lib/db-main.js';

let dbs = {
    [mainDb.name] : mainDb
};

export default {
    getDb,
    getObjectStore
};

// getObjectStore :: String, String, String?, String? -> Promise<IDBObjectStore>
function getObjectStore(storeName, permission, dbName, dbVersion) {
    return getDb.apply(null, Array.from(arguments).slice(2))
                .then(db => db.transaction(storeName, permission).objectStore(storeName));
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
