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

    this.progress       = document.createElement('progress');
    this.progress.max   = 100;
    this.progress.value = 0;
    this.appendChild(this.progress);
    this.appendChild(document.createElement('span'));

    this.addEventListener('click', () => {
        this.dataset.importing = 'true';

        getFile(this.src, this.progress)
            .then(loadFile.bind(this))
            .then(showLoadedUi.bind(this));
    });
}

// getFile :: String, Element -> Promise<File>
function getFile(key, el) {
    return new Promise((res, rej) => {
        s3.getObject({
            Key : key
        }, (err, data) => {
            if (err) return rej(err);

            res(new File([data.Body], stripPrefix(key), { type : data.ContentType }));
        }).on('httpDownloadProgress', progress => {
            el.value = Math.floor(progress.loaded / progress.total * 100);
        });
    });
}

// loadFile :: File -> Promise<undefined>
function loadFile(file) {
    return document.querySelector('maenad-loader').load([file]);
}

// showFileName :: String -> undefined
function showFileName(src) {
    this.querySelector('span').textContent = stripPrefix(src);
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
