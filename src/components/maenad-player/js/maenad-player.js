import data       from 'lib/data.js';
import registerEl from 'lib/register-element.js';

export default registerEl('maenad-player', {
    attachedCallback,
    createdCallback
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    data.getFirstSong().then(song => {
        if (song) this.querySelector('audio').src = URL.createObjectURL(song.file);
    });
}

// createdCallback :: undefined -> undefined
function createdCallback() {
    let audioEl      = document.createElement('audio');
    audioEl.controls = true;
    this.appendChild(audioEl);
}
