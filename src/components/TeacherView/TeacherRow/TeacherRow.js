// library
import React, { useRef, useEffect, useCallback } from 'react';
import { session } from '@voxeet/voxeet-web-sdk';
// internal
// components
import ScreenshareButton from '../../UI/ScreenshareButton/ScreenshareButton';
// style
import './TeacherRow.scss';

export default function TeacherRow({ teacherParticipantId }) {
  const ref = useRef();
  const videoRef = useRef();
  const screenshareRef = useRef();
  const { stream, isVideo, isScreenshare } = teacherParticipantId;

  const isSelf =  (teacherParticipantId.id === session.participant.id) ? true:false

  const setupVideo = useCallback(({ stream }) => {
    const cameraStream = stream.find((el) => el.type === 'Camera');
    navigator.attachMediaStream(videoRef.current, cameraStream);
  }, []);

  const setupScreenshare = useCallback(({ stream }) => {
    const screenshareStream = stream.find((el) => el.type === 'ScreenShare');
    navigator.attachMediaStream(screenshareRef.current, screenshareStream);
  }, []);

  useEffect(() => {
    if (isVideo) {
      setupVideo({ stream });
    }
  }, [isVideo, setupVideo, stream]);

  useEffect(() => {
    if (isScreenshare) {
      setupScreenshare({ stream });
    }
  }, [isScreenshare, setupScreenshare, stream]);

  return (
    <div className="teacher-row">
      <div className="teacher-row__left">
        <div className="teacher" ref={ref}>
          {isVideo ? (
            <video
              id="teacher-video-object"
              className={isSelf? 'teacher__video flipped':'teacher__video'}
              ref={videoRef}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              playsInline
              autoPlay
              muted
            />
          ) : null}
          {
            // TODO bring back names, maybe, when we get them.
            /* Curran: ISSUE 119 Styling - teacher muted video */
          }
        </div>
      </div>
      <div className="teacher-row__right">
        <div className="screenshare-container">
          {isScreenshare ? (
            <video
              id="teacher-screenshare-object"
              className="teacher__screenshare"
              ref={screenshareRef}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              playsInline
              autoPlay
              muted
            />
          ) : null}
          <ScreenshareButton />
        </div>
      </div>
    </div>
  );
}
