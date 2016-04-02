let dbDef = {
    name     : 'maenad',
    version  : 2,
    upgrades : [upgrade1, upgrade2]
};

export default dbDef;

// upgrade1 :: IDBVersionChangeEvent -> undefined
function upgrade1(e) {
    logVersionUpgrade(e, 1);

    e.target.result.createObjectStore('song', { autoIncrement : true, keyPath : 'id' });
}

// upgrade2 :: IDBVersionChangeEvent -> undefined
function upgrade2(e) {
    logVersionUpgrade(e, 2);

    e.target.result.createObjectStore('config', { keyPath : 'name' })
                   .createIndex('value', 'value', { unique : false });
}

// logVersionUpgrade :: IDBVersionChangeEvent, String -> undefined
function logVersionUpgrade(e, currentVersionUpgrade) {
    console.info(`Upgrading ${ dbDef.name } from version ${ e.oldVersion } to version ${ e.newVersion }, currently at upgrade ${ currentVersionUpgrade }.`);
}
