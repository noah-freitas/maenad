import config from 'lib/maenad-config.js';

AWS.config.update({
    accessKeyId     : config.AWS.accessKeyId,
    secretAccessKey : config.AWS.secretAccessKey
});

export default new AWS.S3({
    params : {
        Bucket : config.AWS.bucket
    }
});
