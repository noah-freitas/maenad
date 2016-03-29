import data       from 'lib/data.js';
import registerEl from 'lib/register-element.js';

export default registerEl('maenad-player', {
    attachedCallback,
    createdCallback,
    play
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    data.getFirstSong().then(song => this.play(song));
}

// createdCallback :: undefined -> undefined
function createdCallback() {
    let audioEl      = document.createElement('audio');
    audioEl.controls = true;
    this.appendChild(audioEl);
}

// play :: Song -> undefined
function play(song) {
    let audio = this.querySelector('audio');

    if (!song) {
        audio.src = null;
        audio.pause();
    } else {
        audio.src = URL.createObjectURL(song.file);
        audio.play();
    }
}
