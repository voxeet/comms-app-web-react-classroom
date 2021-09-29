import { useState, useEffect, useCallback, useMemo } from 'react';

import {
  setTeacherId,
  setUserIdInSeat,
  setUserHandRaised,
} from '../utils/firebaseUtils';

import { useEventListener } from '../providers/useEventListener';
import AudioVideoControls from '../components/UI/AudioVideoControls/AudioVideoControls';
import RaiseHandButton from '../components/UI/RaiseHandButton/RaiseHandButton';
import SwapRolesButton from '../components/UI/SwapRolesButton/SwapRolesButton';
import StudentsRow from '../components/StudentView/StudentsRow/StudentsRow';
import TeacherRow from '../components/StudentView/TeacherRow/TeacherRow';
import NoTeacherRow from '../components/StudentView/NoTecherRow/NoTecherRow';
import CalledOnNotification from '../components/StudentView/CalledOnNotification/CalledOnNotification';
import SeatSelection from '../components/StudentView/SeatSelection/SeatSelection';
import YouAre from '../components/UI/YouAre/YouAre';
import './StudentView.scss';

function StudentView({
  cell,
  selfId,
  teacherId,
  participantList,
  classRoom,
  isUserAudioActive,
  isUserVideoActive,
  handleAudioActiveUpdate,
  handleVideoActiveUpdate,
}) {
  const [userSeat, setUserSeat] = useState(null);

  const handleBeforeUnload = useCallback(() => {
    if (userSeat !== null) {
      setUserIdInSeat({ cell, seat: userSeat, userId: false });
    }
  }, [cell, userSeat]);

  // memoize hand raised state
  const isHandRaised = useMemo(() => {
    if (userSeat !== null) {
      return classRoom[userSeat].isHandRaised;
    }
  }, [classRoom, userSeat]);

  // memoize is called on
  const isCalledOn = useMemo(() => {
    if (userSeat !== null) {
      return classRoom[userSeat].isCalledOn;
    }
  }, [classRoom, userSeat]);

  // event handlers
  const handleSwapRoles = useCallback(() => {
    // get your own seat

    if (userSeat !== null) {
      setUserIdInSeat({ cell, seat: userSeat, userId: false });
      setUserSeat(null);
    }

    // setTeacherId({ cell, teacherId: null });
  }, [userSeat, cell]);
  const handleBecomeTheTeacher = useCallback(() => {
    setTeacherId({ cell, teacherId: selfId });
  }, [cell, selfId]);

  const handleSeatSelection = useCallback(
    ({ seat }) => {
      // need to update the classroom object in firebase
      setUserIdInSeat({
        cell,
        seat,
        userId: selfId,
      });
      setUserSeat(seat);
    },
    [cell, selfId]
  );

  const handleRaiseHandButton = useCallback(() => {
    setUserHandRaised({ cell, seat: userSeat, isHandRaised: !isHandRaised });
  }, [cell, userSeat, isHandRaised]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === ' ') {
        // console.log('keydown', e.key, { isCalledOn, isUserAudioActive });
        if (!isUserAudioActive && isCalledOn) {
          handleAudioActiveUpdate(true);
        }
      }
    },
    [isCalledOn, isUserAudioActive, handleAudioActiveUpdate]
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (e.key === ' ') {
        if (isUserAudioActive) {
          handleAudioActiveUpdate(false);
        }
      }
    },
    [isUserAudioActive, handleAudioActiveUpdate]
  );

  // load actions
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    // need to release the seat if user naviagtes away or switches roles
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userSeat !== null) {
        setUserIdInSeat({ cell, seat: userSeat, userId: false });
      }
    };
  }, [userSeat, cell, handleBeforeUnload]);

  // event listeners
  useEventListener('keydown', handleKeyDown);
  useEventListener('keyup', handleKeyUp);

  // data modifiers
  const studentsParticipantList = participantList.filter(
    (p) => p.id !== teacherId
  );
  const teacherParticipantId = teacherId
    ? participantList.find((p) => p.id === teacherId)
    : null;

  // assemble view
  const seatSelection =
    classRoom && userSeat === null ? (
      <SeatSelection
        classRoom={classRoom}
        teacherId={teacherId}
        selectionHandler={handleSeatSelection}
        teacherSelectionHandler={handleBecomeTheTeacher}
      />
    ) : null;

  const teacherRow = teacherParticipantId ? (
    <TeacherRow teacherParticipantId={teacherParticipantId} />
  ) : (
    <NoTeacherRow />
  );

  const raiseHandButton =
    userSeat !== null && !isCalledOn ? (
      <RaiseHandButton
        isRaised={isHandRaised}
        onRaiseHand={handleRaiseHandButton}
      />
    ) : null;

  const swapRolesButton = !isCalledOn ? (
    <SwapRolesButton handleSwap={handleSwapRoles} />
  ) : null;

  const isCalledOnNotification = isCalledOn ? (
    <CalledOnNotification
      isUserAudioActive={isUserAudioActive}
      participantList={participantList}
    />
  ) : null;

  return (
    <div className="student-view">
      {/* Absolute positioned */}
      {seatSelection}
      <AudioVideoControls
        isUserVideoActive={isUserVideoActive}
        isUserAudioActive={isUserAudioActive}
        handleVideoButton={handleVideoActiveUpdate}
        handleAudioButton={handleAudioActiveUpdate}
        hideMuteButton={true}
      />
      {/* top bar */}
      <div className="student-view__top-controls">
        {/* default view */}
        <YouAre role={'student'} />
        {/* {!isCalledOn ? (
          <div className="spacer" style={{ width: '140px' }}></div>
        ) : null} */}
        {raiseHandButton}
        {swapRolesButton}
        {/* if called on */}
        {/* Curran: ISSUE 125 */}
        {isCalledOnNotification}
      </div>

      {/* view components */}
      {teacherRow}
      <StudentsRow
        studentsParticipantList={studentsParticipantList}
        classRoom={classRoom}
      />
    </div>
  );
}

export default StudentView;
