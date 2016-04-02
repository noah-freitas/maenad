import config from 'lib/config.js';

AWS.config.update({
    accessKeyId     : config.AWS.accessKeyId,
    secretAccessKey : config.AWS.secretAccessKey
});

export default new AWS.S3({
    params : {
        Bucket : config.AWS.bucket
    }
});
