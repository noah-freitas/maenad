let config = JSON.parse(localStorage.config || `{
    "AWS" : {
        "accessKeyId"     : "",
        "bucket"          : "",
        "secretAccessKey" : "",
        "songsPrefix"     : ""
    },
    "player" : {
        "notifications" : false
    }
}`);

// 0.4.0
if (!config.player) config.player = { notifications : false };

export default config;
