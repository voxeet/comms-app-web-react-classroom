// library
import React from 'react';
// internal
// components
import MicOnOffIcon from '../../assets/MicOnOffIcon';
import VideoOnOffIcon from '../../assets/VideoOnOffIcon';
import './AudioVideoControls.scss';

export default function AudioVideoControls({
  isUserVideoActive,
  isUserAudioActive,
  handleVideoButton,
  handleAudioButton,
  hideMuteButton,
}) {
  const audioButton = !hideMuteButton ? (
    <div
      className={`audio-video-controls__button ${
        !isUserAudioActive ? '' : 'is-active'
      }`}
      onClick={() => handleAudioButton(!isUserAudioActive)}
    >
      <MicOnOffIcon
        width={30}
        height={30}
        fill={'white'}
        isAudioOff={!isUserAudioActive}
      />
    </div>
  ) : null;

  const videoButton = (
    <div
      className={`audio-video-controls__button ${
        !isUserVideoActive ? '' : 'is-active'
      }`}
      onClick={() => handleVideoButton(!isUserVideoActive)}
    >
      <VideoOnOffIcon
        width={34}
        height={34}
        fill={'white'}
        isVideoOff={!isUserVideoActive}
      />
    </div>
  );

  return (
    <div className="audio-video-controls">
      {audioButton}
      {videoButton}
    </div>
  );
}
