import data                  from 'lib/data.js';
import MaenadSongItemElement from 'components/maenad-song-item/js/maenad-song-item.js';
import registerEl            from 'lib/register-element.js';

export default registerEl('maenad-song-list', {
    attachedCallback,
    showSongs
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    data.getAllSongs().then(songs => this.showSongs(songs));

    this.addEventListener('click', e => {
        let listItem = e.target.closest('maenad-song-item');
        if (listItem) document.querySelector('maenad-player').play(listItem.song);
    });
}

// showSongs :: [Song] -> undefined
function showSongs(songs) {
    songs.forEach(showSong.bind(this));

    // showSong :: Song -> undefined
    function showSong(song) {
        let songItem  = new MaenadSongItemElement();
        songItem.song = song;
        this.appendChild(songItem);
    }
}
