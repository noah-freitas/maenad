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
    let audioEl = document.createElement('audio'),
        titleEl = document.createElement('h1');

    audioEl.controls    = true;
    audioEl.hidden      = true;
    titleEl.textContent = 'Maenad Player';
    this.appendChild(titleEl);
    this.appendChild(audioEl);
}

// play :: Song -> Promise<undefined>
function play(song) {
    let audio = this.querySelector('audio'),
        title = this.querySelector('h1');

    if (!song) {
        audio.src = null;
        audio.pause();
        title.textContent = 'Maenad Player';
        return Promise.resolve(undefined);
    };

    return song.file.then(file => {
        audio.src = URL.createObjectURL(file);
        audio.play();
        title.textContent = `${ song.title } by ${ song.artist } from ${ song.album }`;
    });
}
