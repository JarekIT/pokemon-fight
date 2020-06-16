let embedPl = document.querySelector('.background-pl');
let embedUs = document.querySelector('.background-us');

const setBackgroundSongPL = () => {

    embedPl.volume = 0.1;
    embedPl.setAttribute('type','audio/mpeg');
    embedPl.setAttribute('src', '/audio/background-pl.mp3');
}

const setBackgroundSongUS = () => {

    embedUs.volume = 0.05;
    embedUs.setAttribute('type','audio/mpeg');
    embedUs.setAttribute('src', '/audio/background.mp3');
}

setBackgroundSongPL();
setBackgroundSongUS();
