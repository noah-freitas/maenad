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
        artist = document.createElement('span');

    title.classList.add('title');
    artist.classList.add('artist');

    this.appendChild(title);
    this.appendChild(document.createTextNode(' by '));
    this.appendChild(artist);
}

// showSong :: Song -> undefined
function showSong(song) {
    this.querySelector('span.title').textContent  = song.title;
    this.querySelector('span.artist').textContent = song.artist;
}
