import cfg        from 'lib/maenad-config.js';
import registerEl from 'lib/register-element.js';

AWS.config.update({
    accessKeyId     : cfg.AWS.accessKeyId,
    secretAccessKey : cfg.AWS.secretAccessKey
});

export default registerEl('maenad-aws-importer', {
    attachedCallback
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    let s3 = new AWS.S3({ params : { Bucket : cfg.AWS.bucket }});

    s3.listObjects({
        Prefix : cfg.AWS.songsPrefix
    }, (err, res) => {
        if (err) throw err;

        res.Contents.forEach(obj => {
            let div         = document.createElement('div');
            div.textContent = stripPrefix(obj.Key);
            this.appendChild(div);
        });

        let testFile = res.Contents[100];
        console.info('Getting', testFile);
        s3.getObject({
            Key : testFile.Key
        }, (err, data) => {
            let file = new File([data.Body], stripPrefix(testFile.Key), { type : data.ContentType });
            console.info('Got test file and converted to file object: ', file);
        });
    });

    // stripPrefix :: String -> String
    function stripPrefix(str) {
        return str.replace(`${ cfg.AWS.songsPrefix }/`, '');
    }
}
