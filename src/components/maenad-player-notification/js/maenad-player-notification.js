import registerEl from 'lib/register-element.js';

export default registerEl('maenad-player-notification', {
    attachedCallback,
    createdCallback
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    let config = this.ownerDocument.querySelector(this.dataset.configurationProvider);

    if (config.player.notifications) switch (Notification.permission) {
        case 'granted'  : return registerListener.call(this, 'granted');
        case 'denied'   :
        case 'default'  : return Notification.requestPermission(registerListener.bind(this));
    }
}

// createdCallback :: undefined -> undefined
function createdCallback() {
    this.playListener = playListener.bind(this);
}

// playListener :: CustomEvent -> undefined
function playListener(e) {
    let song = e.detail;

    new Notification(song.title, {
        body : `${ song.artist } - ${ song.album }`,
        tag  : 'currentlyPlaying'
    });
}

// registerListener :: String -> undefined
function registerListener(status) {
    let func = this.ownerDocument[status === 'granted' ? 'addEventListener' : 'removeEventListener']
                   .bind(this.ownerDocument);

    func('maenad:start-playing', this.playListener);
}
