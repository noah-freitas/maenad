export default JSON.parse(localStorage.config || `{
    "AWS" : {
        "accessKeyId"     : "",
        "bucket"          : "",
        "secretAccessKey" : "",
        "songsPrefix"     : ""
    }
}`);
