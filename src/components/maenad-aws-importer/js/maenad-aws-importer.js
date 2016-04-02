import config                       from 'lib/config.js';
import MaenadAwsSongImporterElement from 'components/maenad-aws-song-importer/js/maenad-aws-song-importer.js';
import registerEl                   from 'lib/register-element.js';
import s3                           from 'lib/s3.js';

export default registerEl('maenad-aws-importer', {
    attachedCallback
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    s3.listObjects({
        Prefix : config.AWS.songsPrefix
    }, (err, resp) => {
        if (err) throw err;

        resp.Contents
            .filter(obj => !obj.Key.endsWith('/'))
            .forEach(obj => {
                let songEl = new MaenadAwsSongImporterElement();
                songEl.src = obj.Key;
                this.appendChild(songEl);
            });
    });
}
