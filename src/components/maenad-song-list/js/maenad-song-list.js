import data                  from 'lib/data.js';
import MaenadSongItemElement from 'components/maenad-song-item/js/maenad-song-item.js';
import registerEl            from 'lib/register-element.js';

let eventListeners = new Map();

export default registerEl('maenad-song-list', {
    attachedCallback,
    createdCallback,
    detachedCallback,
    showSongs
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    let listeners = eventListeners.get(this);

    data.getAllSongs().then(songs => this.showSongs(songs));
    this.addEventListener('click', listeners.click);
    this.ownerDocument.addEventListener('maenad:done-playing', listeners['maenad:done-playing']);
}

// createdCallback :: undefined -> undefined
function createdCallback() {
    eventListeners.set(this, {
        click                 : handleClick.bind(this),
        'maenad:done-playing' : handleDonePlaying.bind(this)
    });
}

// detachedCallback :: undefined -> undefined
function detachedCallback() {
    this.removeEventListener('click', listeners.click);
    this.ownerDocument.removeEventListener('maenad:done-playing', listeners['maenad:done-playing']);
}

// showSongs :: [Song] -> undefined
function showSongs(songs) {
    this.songs = songs;
    songs.forEach(showSong.bind(this));

    // showSong :: Song -> undefined
    function showSong(song) {
        let songItem  = new MaenadSongItemElement();
        songItem.song = song;
        this.appendChild(songItem);
    }
}

// handleClick :: MouseEvent -> undefined
function handleClick(e) {
    let listItem = e.target.closest('maenad-song-item');
    if (listItem) document.querySelector('maenad-player').play(listItem.song);
}

// handleDonePlaying :: CustomEvent -> undefined
function handleDonePlaying(e) {
    let nextSong = this.songs[this.songs.findIndex(s => e.detail.id === s.id) + 1] || this.songs[0];
    document.querySelector('maenad-player').play(nextSong);
}
