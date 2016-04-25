import registerEl from 'lib/register-element.js';

let songsForEls = new WeakMap();

export default registerEl('maenad-song-item', {
    createdCallback,
    showSong
});

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
    this.classList.add('maenad-list-item');

    this.appendChild(title);
    this.appendChild(artist);
    this.appendChild(album);
}

// showSong :: Song -> undefined
function showSong(song) {
    this.querySelector('span.title').textContent  = song.title;
    this.querySelector('span.artist').textContent = song.artist;
    this.querySelector('span.album').textContent  = song.album;
}
