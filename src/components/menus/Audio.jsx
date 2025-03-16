import useSound from 'use-sound';
import React from 'react'

export const Audio = () => {
  const music = '/assets/audio/1.mp3';
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMute, setIsMute] = React.useState(true);
  const [play, { stop }] = useSound(music, {
    interrupt: true,
    volume:0.25,
    loop: true
  });
  const checkForPlayMusic = () => {
    if(isPlaying == false) {
      play();
      setIsPlaying(true);
    } else {
      stop();
      setIsPlaying(false);
    }
  }
  return (
    <>
      <svg className='player' onClick={checkForPlayMusic} width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        {isPlaying ? (
          <image href='/public/assets/images/musical-note.svg' height="50" width="50" />
        ) : (
          <image href='/public/assets/images/musical-note-no.svg' height="50" width="50" />
        )}
      </svg>
    </>
  )
}