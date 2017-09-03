import data       from 'lib/data.js';
import registerEl from 'lib/register-element.js';

let songsForEls = new WeakMap();

export default registerEl('maenad-song-item', {
    attachedCallback,
    createdCallback,
    detachedCallback,
    showSong
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    document.addEventListener('maenad:start-playing', this.playingCallback);
}

// createdCallback :: undefined -> undefined
function createdCallback() {
    Object.defineProperty(this, 'song', {
        get : ()   => songsForEls.get(this),
        set : song => {
            songsForEls.set(this, song);
            this.showSong(song);
            return song;
        }
    });

    let title  = document.createElement('span'),
        album  = document.createElement('span'),
        artist = document.createElement('span');

    title.classList.add('title');
    album.classList.add('album');
    artist.classList.add('artist');

    let menuId      = 'maenad-contextmenu-' + Math.random().toString(16).substr(2),
        contextMenu = document.createElement('menu');

    let deleteMenuItem   = document.createElement('menuitem');
    deleteMenuItem.label = 'Delete Song';
    deleteMenuItem.type  = 'command';
    deleteMenuItem.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        data.deleteSong(this.song.id).then(_ => this.remove());
    });
    contextMenu.appendChild(deleteMenuItem);

    contextMenu.id   = menuId;
    contextMenu.type = 'context';
    this.setAttribute('contextmenu', menuId);

    this.appendChild(title);
    this.appendChild(artist);
    this.appendChild(album);
    this.appendChild(contextMenu);

    this.playingCallback = handlePlayingEvent.bind(this);
}

// detachedCallback :: undefined -> undefined
function detachedCallback() {
    document.removeEventListener('maenad:start-playing', this.playingCallback);
}

// handlePlayingEvent :: CustomEvent -> undefined
function handlePlayingEvent(e) {
    this.dataset.playing = String(e.detail.id === this.song.id);
}

// showSong :: Song -> undefined
function showSong(song) {
    this.querySelector('span.title').textContent  = song.title;
    this.querySelector('span.artist').textContent = song.artist;
    this.querySelector('span.album').textContent  = song.album;
}
