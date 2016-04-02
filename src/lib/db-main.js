let dbDef = {
    name     : 'maenad',
    version  : 1,
    upgrades : [upgrade1]
};

export default dbDef;

// upgrade1 :: IDBVersionChangeEvent -> undefined
function upgrade1(e) {
    logVersionUpgrade(e, 1);

    let os = e.target.result.createObjectStore('song', { autoIncrement : true, keyPath : 'id' });
    os.createIndex('album' , 'album' , { unique : false });
    os.createIndex('artist', 'artist', { unique : false });
    os.createIndex('title' , 'title' , { unique : false });
}

// logVersionUpgrade :: IDBVersionChangeEvent, String -> undefined
function logVersionUpgrade(e, currentVersionUpgrade) {
    console.info(`Upgrading ${ dbDef.name } from version ${ e.oldVersion } to version ${ e.newVersion }, currently at upgrade ${ currentVersionUpgrade }.`);
}
