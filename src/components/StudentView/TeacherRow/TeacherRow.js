// library
import React, { useRef, useEffect, useCallback } from 'react';
// internal
// components
// style
import './TeacherRow.scss';

export default function TeacherRow({ teacherParticipantId }) {
  const ref = useRef();
  const videoRef = useRef();
  const screenshareRef = useRef();
  const { stream, isVideo, isScreenshare } = teacherParticipantId;

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

  // TODO - remove extra div in here
  return (
    <div className="teacher-row-student-view">
      <div className="teacher-row-student-view__left">
        <div className="teacher" ref={ref}>
          {isVideo ? (
            <video
              id="teacher-video-object"
              className="teacher__video"
              ref={videoRef}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
              playsInline
              autoPlay
              muted
            />
          ) : null}
          {/* {<div className="">{teacherParticipantId.name}</div>} */}
        </div>
      </div>
      <div className="teacher-row-student-view__right">
        <div className="screenshare-container">
          {isScreenshare ? (
            <video
              id="teacher-screenshare-object"
              className="teacher__screenshare"
              ref={screenshareRef}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }}
              playsInline
              autoPlay
              muted
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
