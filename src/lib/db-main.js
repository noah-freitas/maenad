let dbDef = {
    name     : 'maenad',
    version  : 1,
    upgrades : [upgrade1]
};

export default dbDef;

// upgrade1 :: IDBVersionChangeEvent -> undefined
function upgrade1(e) {
    console.info(`Upgrading ${ dbDef.name } from version ${ e.oldVersion } to version ${ e.newVersion }, currently at upgrade 1.`);

    e.target.result.createObjectStore('song', { keyPath : 'title' });
}
