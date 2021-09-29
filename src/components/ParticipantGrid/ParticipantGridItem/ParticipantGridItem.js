// library
import React, { useEffect, useCallback, useRef } from 'react';
// internal
// components
import '../../assets/VideoOnOffIcon';
import VideoOnOffIcon from '../../assets/VideoOnOffIcon';
import HandIcon from '../../assets/HandIcon';
// styles
import './ParticipantGridItem.scss';

export default function ParticipantGridItem({
  participantInfo,
  isHandRaised,
  isCalledOn,
  handleClick,
  name,
  isSelf
}) {
  const ref = useRef();
  const videoRef = useRef();
  const { id, stream, isVideo } = participantInfo;

  const setupVideo = useCallback(({ stream }) => {
    const cameraStream = stream.find((el) => el.type === 'Camera');

    navigator.attachMediaStream(videoRef.current, cameraStream);
  }, []);

  // watcher for isVideo flag
  useEffect(() => {
    if (isVideo) {
      setupVideo({ stream });
    }
  }, [isVideo, stream, ref, id, setupVideo]);

  const handRaisedView = isHandRaised ? (
    <HandIcon
      height={60}
      width={50}
      fill="#50b06c"
      additionalStyles={{ position: 'absolute', bottom: '10px', left: '10px' }}
    />
  ) : null;

  const displayName = participantInfo.isYou ? `${name} (You)` : name;

  return (
    <div
      className={`participant-grid-item ${isSelf?' flipped':''} ${isCalledOn ? 'called-on' : ''} ${
        isHandRaised ? 'hand-raised' : ''
      }`}
      ref={ref}
      onClick={handleClick}
    >
      {isVideo ? (
        <video
          id="video-object"
          className="participant-grid-item__video"
          ref={videoRef}
          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          playsInline
          autoPlay
          muted
        />
      ) : null}
      {!isVideo ? (
        <div className="participant-grid-item__no-video-icon-container">
          <VideoOnOffIcon
            width={60}
            height={60}
            fill="#ffffff55"
            isVideoOff={true}
          />
        </div>
      ) : null}
      <div
        className={`participant-grid-item__name ${
          isHandRaised ? 'hand-raised' : ''
        } ${isCalledOn ? 'called-on' : ''}`}
      >
        {displayName}
      </div>
      {handRaisedView}
      <div className="outline" />
      {isCalledOn ? (
        <div className="called-on-notice">
          Student has been called on.
          <br />
          Click again to mute.
        </div>
      ) : (
        <div className="call-on-notice">Click to call on</div>
      )}
    </div>
  );
}
