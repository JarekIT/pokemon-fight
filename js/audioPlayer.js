const playBackgroundSong = () => {
    let embed = document.querySelector('audio');

    embed.volume = 0.05;
    embed.setAttribute('type','audio/mpeg');
    embed.setAttribute('src', '/audio/background.mp3');
    embed.setAttribute('autoplay',true);
    embed.setAttribute('controls',true);
    embed.setAttribute('loop',true);
}

playBackgroundSong()
