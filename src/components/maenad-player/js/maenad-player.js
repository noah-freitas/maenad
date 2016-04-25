import data       from 'lib/data.js';
import registerEl from 'lib/register-element.js';

let eventListeners = new Map();

export default registerEl('maenad-player', {
    attachedCallback,
    createdCallback,
    detachedCallback,
    play
});

// attachedCallback :: undefined -> undefined
function attachedCallback() {
    let audioEl   = this.querySelector('audio'),
        listeners = eventListeners.get(this);
    this.addEventListener('click', listeners.click);
    audioEl.addEventListener('timeupdate', listeners.timeupdate);
    audioEl.addEventListener('play', listeners.play);
    audioEl.addEventListener('pause', listeners.pause);
    data.getFirstSong().then(song => this.play(song));
}

// createdCallback :: undefined -> undefined
function createdCallback() {
    attachTemplate.call(this);
    createListeners.call(this);

    // attachTemplate :: undefined -> undefined
    function attachTemplate() {
        let audioEl  = document.createElement('audio'),
            titleEl  = document.createElement('h1'),
            progress = document.createElement('span');

        progress.classList.add('play-progress');
        audioEl.controls    = true;
        audioEl.hidden      = true;
        titleEl.textContent = 'Maenad Player';
        this.appendChild(titleEl);
        this.appendChild(audioEl);
        this.appendChild(progress);
    }

    // createListeners :: undefined -> undefined
    function createListeners() {
        eventListeners.set(this, {
            pause      : playStateHandler.bind(this, 'paused'),
            click      : clickHandler.bind(this),
            play       : playStateHandler.bind(this, 'playing'),
            timeupdate : timeupdateHandler.bind(this)
        });
    }
}

// detachedCallback :: undefined -> undefined
function detachedCallback() {
    let audioEl   = this.querySelector('audio'),
        listeners = eventListeners.get(this);

    this.removeEventListener('click', listeners.click);
    audioEl.removeEventListener('timeupdate', listeners.timeupdate);
    audioEl.removeEventListener('play', listeners.play);
    audioEl.removeEventListener('pause', listeners.pause);
}

// play :: Song -> Promise<undefined>
function play(song) {
    let audio = this.querySelector('audio'),
        title = this.querySelector('h1');

    this.querySelector('.play-progress').style.width = '0';

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

// clickHandler :: MouseEvent -> undefined
function clickHandler(e) {
    let audio = this.querySelector('audio');
    if (audio.paused) audio.play();
    else              audio.pause();
}

// playStateHandler :: String -> undefined
function playStateHandler(state) {
    this.dataset.playingState = state;
}

// timeupdateHandler :: Event -> undefined
function timeupdateHandler(e) {
    let secondsSoFar  = e.timeStamp / 1000,
        totalSeconds  = e.target.duration,
        percentPlayed = Math.floor(secondsSoFar / totalSeconds * 100);

    requestAnimationFrame(() => this.querySelector('.play-progress').style.width = `${ percentPlayed }%`);

    if (percentPlayed === 100) this.dispatchEvent(new CustomEvent('maenad-player:done-playing', { bubbles : true }));
}
