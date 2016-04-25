import config                       from 'lib/config.js';
import MaenadAwsSongImporterElement from 'components/maenad-aws-song-importer/js/maenad-aws-song-importer.js';
import registerEl                   from 'lib/register-element.js';
import s3                           from 'lib/s3.js';

export default registerEl('maenad-aws-importer', {
    attachedCallback
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    getSongs(this);
}

// getSongs :: MaenadAwsImporterElement, String? -> undefined
function getSongs(el, startKey) {
    let reqOpts = {
        MaxKeys : 1000,
        Prefix  : config.AWS.songsPrefix
    };

    if (startKey) reqOpts.Marker = startKey;

    s3.listObjects(reqOpts, handleResp);

    // handleResp :: Error || null || AWS.Response
    function handleResp(err, resp) {
        if (err) throw err;

        var songs = resp.Contents.slice(startKey ? 1 : 0).filter(obj => !obj.Key.endsWith('/'));

        songs.forEach(obj => {
            let songEl = new MaenadAwsSongImporterElement();
            songEl.src = obj.Key;
            el.appendChild(songEl);
        });

        if (resp.IsTruncated) getSongs(el, songs[songs.length - 1].Key);
    }
}
