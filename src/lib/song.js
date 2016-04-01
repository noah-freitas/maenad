import id3 from 'lib/id3-43081j.js';

export default song;

// song :: File -> Song
function song(file) {
    return new Promise((res, rej) =>
        id3(file, (err, metadata) => err ? rej(err) : res(metadata))
    ).then(metadata =>
        Object.assign(iD3DataConverter(metadata), {
            file,
            metadata
        })
    ).catch(err => {
        console.error(`Could not get info for ${ file.name }`, err, err.stack);

        return {
            album    : null,
            artist   : null,
            title    : null,
            year     : null,
            file,
            metadata : {}
        };
    });

    // iD3DataConverter :: id3Format -> ID3Data
    function iD3DataConverter(data) {
        return {
            album  : data.album,
            artist : data.artist,
            title  : data.title,
            year   : data.year
        };
    }
}

// Song :: {
//     album    :: String
//     artist   :: String
//     file     :: File
//     metadata :: id3Format
//     title    :: String
//     year     :: Number
// }

// id3Format :: {
//     artist :: String
//     title  :: String
//     album  :: String
//     year   :: Number
//     v1     :: {
//         title   :: String
//         artist  :: String
//         album   :: String
//         year    :: Number
//         comment :: String
//         track   :: Number
//         version :: Number
//     },
//     v2 :: {
//         artist  :: String
//         album   :: String
//         version :: [Number, Number]
//     }
// }
