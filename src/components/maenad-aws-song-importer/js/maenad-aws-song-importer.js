import config     from 'lib/config.js';
import registerEl from 'lib/register-element.js';
import s3         from 'lib/s3.js';

let elSrcs = new Map();

export default registerEl('maenad-aws-song-importer', {
    createdCallback
});

// createdCallback :: undefined -> undefined
function createdCallback() {
    Object.defineProperty(this, 'src', {
        get : ()  => elSrcs.get(this),
        set : src => {
            showFileName.call(this, src);
            elSrcs.set(this, src);
            return src;
        }
    });

    this.addEventListener('click', () => {
        this.dataset.importing = 'true';

        getFile(this.src)
            .then(loadFile.bind(this))
            .then(showLoadedUi.bind(this));
    });
}

// getFile :: String -> Promise<File>
function getFile(key) {
    return new Promise((res, rej) => {
        s3.getObject({
            Key : key
        }, (err, data) => {
            if (err) return rej(err);

            res(new File([data.Body], stripPrefix(key), { type : data.ContentType }));
        });
    });
}

// loadFile :: File -> Promise<undefined>
function loadFile(file) {
    return document.querySelector('maenad-loader').load([file]);
}

// showFileName :: String -> undefined
function showFileName(src) {
    this.textContent = stripPrefix(src);
}

// showLoadedUi :: undefined -> undefined
function showLoadedUi() {
    delete this.dataset.importing;
    this.dataset.imported = 'true';
}

// stripPrefix :: String -> String
function stripPrefix(str) {
    return str.replace(`${ config.AWS.songsPrefix }/`, '');
}
