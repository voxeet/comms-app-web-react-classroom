import { useState, useEffect, useCallback } from 'react';

import { conference, session } from '@voxeet/voxeet-web-sdk';
import {
  createConference,
  joinConference,
  startVideo,
  stopVideo,
  startAudio,
  stopAudio,
} from './utils/voxeetUtils';
import {
  subscribeToTeacherUpdates,
  subscribeToClassRoomUpdates,
  setUserIdInSeat,
} from './utils/firebaseUtils';
import TeacherView from './views/TeacherView';
import StudentView from './views/StudentView';
import MediaSelectors from './components/UI/MediaSelectors/MediaSelectors';
import { useKillZombies } from './useKillZombies';
import './App.scss';

function App() {
  const [cell, setCell] = useState(null);
  const [selfId, setSelfId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [participantList, setParticipantList] = useState([]);
  const [classRoom, setClassRoom] = useState(null);
  const [isUserVideoActive, setIsUserVideoActive] = useState(true);
  const [isUserAudioActive, setIsUserAudioActive] = useState(false);

  // event handlers
  const handleTeacherChange = useCallback(
    ({ newData }) => {
      if (selfId === newData) {
        setIsUserAudioActive(true);
      }
      setTeacherId(newData);
    },
    [selfId]
  );

  const handleClassRoomUpdate = useCallback(({ newData }) => {
    setClassRoom(newData);
  }, []);

  const handleAudioActiveUpdate = useCallback((isActive) => {
    setIsUserAudioActive(isActive);
  }, []);

  const handleVideoActiveUpdate = useCallback((isActive) => {
    setIsUserVideoActive(isActive);
  }, []);

  const streamUpdatedCallback = useCallback(
    (participant, stream) => {
      // handle video
      const thisParticipentIndex = participantList.findIndex((el) => {
        return el.id === participant.id;
      });

      // if not already in list, add
      if (thisParticipentIndex === -1) {
        let nameToAdd, isYou;
        // test to see if the id of this person is you - if so, amend the display name
        if (session.participant.id === participant.id) {
          isYou = true;
          nameToAdd = `${participant.info.name} (you)`;
        } else {
          isYou = false;
          nameToAdd = participant.info.name;
        }

        // create object with name and ID
        const newDetails = {
          name: nameToAdd,
          id: participant.id,
          participant: participant,
          stream: participant.streams,
          isVideo: true,
          isScreenshare: false,
          isYou: isYou,
          isInactive: false,
        };

        // create new list with new value added and set as state
        const newParticipantList = [...participantList, newDetails];
        setParticipantList(newParticipantList);
      } else {
        // if already in list, update
        const newParticipantList = [...participantList];

        let isVideo = false;
        let isScreenshare = false;
        const cameraStream = participant.streams.find((el) => {
          return el.type === 'Camera';
        });
        const screenshareStream = participant.streams.find((el) => {
          return el.type === 'ScreenShare';
        });

        if (cameraStream) {
          isVideo = cameraStream.getVideoTracks().length > 0;
        }
        if (screenshareStream) {
          isScreenshare = screenshareStream.getVideoTracks().length > 0;
        }

        const newDetails = {
          name: newParticipantList[thisParticipentIndex].name,
          id: participant.id,
          participant: participant,
          stream: participant.streams,
          isVideo: isVideo,
          isScreenshare: isScreenshare,
          isYou: newParticipantList[thisParticipentIndex].isYou,
        };

        newParticipantList[thisParticipentIndex] = newDetails;

        setParticipantList(newParticipantList);
      }
    },
    [participantList]
  );

  const streamRemovedCallback = useCallback(
    (participant, stream) => {
      if (participant.status === 'Left') return;

      const thisParticipentIndex = participantList.findIndex((el) => {
        return el.id === participant.id;
      });

      const includesCameraTrack =
        participant.streams.find((el) => {
          return el.type === 'Camera';
        }) !== undefined;

      const includesScreenshareTrack =
        participant.streams.find((el) => {
          return el.type === 'ScreenShare';
        }) !== undefined;

      const newParticipantList = [...participantList];
      const newDetails = {
        name: newParticipantList[thisParticipentIndex].name,
        id: participant.id,
        participant: participant,
        stream: participant.streams,
        isVideo: includesCameraTrack,
        isScreenshare: includesScreenshareTrack,
        isInactive: true,
      };

      newParticipantList[thisParticipentIndex] = newDetails;
      setParticipantList(newParticipantList);
    },
    [participantList]
  );

  const handleParticipantStatusChange = useCallback(
    (participant, stream) => {
      if (participant.status === 'Left') {
        if (!classRoom) return;
        // sometimes a participant's browser will close before the firebase object is reset
        // this is a check to remove anyone who's left but still in the classRoom list

        // find that users seat index in the classRoom object
        const participantSeatIndex = classRoom.findIndex(
          (el) => el.participantId === participant.id
        );
        if (participantSeatIndex !== -1) {
          setUserIdInSeat({ cell, seat: participantSeatIndex, userId: false });
        }

        const newParticipantList = [...participantList].filter(
          (el) => el.id !== participant.id
        );
        setParticipantList(newParticipantList);

        // If the teacher left, track that in Firebase.
        if (participant.id === teacherId) {
          setTeacherId(null);
        }
      }
    },
    [participantList, classRoom, cell, teacherId]
  );

  useKillZombies({
    cell,
    teacherId,
    setTeacherId,
    classRoom,
    setUserIdInSeat,
  });

  const handleExitMessageRecieved = useCallback(() => {
    if (teacherId !== selfId) {
      setTeacherId(null);
    } else {
      const participantSeatIndex = classRoom.findIndex(
        (el) => el.participantId === selfId
      );
      if (participantSeatIndex !== -1) {
        setUserIdInSeat({ cell, seat: participantSeatIndex, userId: false });
      }
    }
  }, [cell, classRoom, selfId, teacherId]);

  // load actions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cell = params.get('cell');
    setCell(cell || 'test1234');

    window.addEventListener('exit', handleExitMessageRecieved);
    return () => {
      window.removeEventListener('exit', handleExitMessageRecieved);
    };
  }, [handleExitMessageRecieved]);

  useEffect(() => {
    if (isUserAudioActive) {
      try {
        startAudio();
      } catch {}
    } else {
      try {
        stopAudio();
      } catch {}
    }
  }, [isUserAudioActive]);

  useEffect(() => {
    if (isUserVideoActive) {
      try {
        startVideo();
      } catch {}
    } else {
      try {
        stopVideo();
      } catch {}
    }
  }, [isUserVideoActive]);

  useEffect(() => {
    if (teacherId !== selfId) {
      setIsUserAudioActive(false);
    }
  }, [teacherId, selfId]);

  useEffect(() => {
    // create and join conference
    if (cell) {
      // listen for teacher changes
      subscribeToTeacherUpdates({
        cell: cell,
        callback: handleTeacherChange,
      });

      createConference(cell)
        .then((conf) => {
          return joinConference(conf);
        })
        .then((newClassRoom) => {
          const newSelfId = session.participant.id;
          setSelfId(newSelfId);
          setClassRoom(newClassRoom);
          subscribeToClassRoomUpdates({
            cell,
            callback: handleClassRoomUpdate,
          });
        });
    }
    // eslint-disable-next-line
  }, [cell, handleClassRoomUpdate]);

  useEffect(() => {
    conference.on('streamAdded', streamUpdatedCallback);
    conference.on('streamUpdated', streamUpdatedCallback);
    conference.on('streamRemoved', streamRemovedCallback);
    conference.on('participantUpdated', handleParticipantStatusChange);

    return () => {
      conference.off('streamAdded', streamUpdatedCallback);
      conference.off('streamUpdated', streamUpdatedCallback);
      conference.off('streamRemoved', streamRemovedCallback);
      conference.off('participantUpdated', handleParticipantStatusChange);
    };
  }, [
    participantList,
    streamUpdatedCallback,
    streamRemovedCallback,
    handleParticipantStatusChange,
  ]);

  // view assembly
  let isTeacherView = false;
  if (selfId === teacherId) {
    isTeacherView = true;
  }

  const view = isTeacherView ? (
    <TeacherView
      cell={cell}
      selfId={selfId}
      teacherId={teacherId}
      participantList={participantList}
      classRoom={classRoom}
      isUserAudioActive={isUserAudioActive}
      isUserVideoActive={isUserVideoActive}
      handleAudioActiveUpdate={handleAudioActiveUpdate}
      handleVideoActiveUpdate={handleVideoActiveUpdate}
    />
  ) : (
    <StudentView
      cell={cell}
      selfId={selfId}
      teacherId={teacherId}
      participantList={participantList}
      classRoom={classRoom}
      isUserAudioActive={isUserAudioActive}
      isUserVideoActive={isUserVideoActive}
      handleAudioActiveUpdate={handleAudioActiveUpdate}
      handleVideoActiveUpdate={handleVideoActiveUpdate}
    />
  );

  return (
    <div className="app">
      <div className="utility-bar">
        <MediaSelectors />
      </div>
      {view}
    </div>
  );
}

export default App;
