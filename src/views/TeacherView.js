import { useEffect, useCallback } from 'react';
import {
  subscribeToTeacherUpdates,
  setTeacherId,
} from '../utils/firebaseUtils';
import AudioVideoControls from '../components/UI/AudioVideoControls/AudioVideoControls';
import SwapRolesButton from '../components/UI/SwapRolesButton/SwapRolesButton';
import StudentsRow from '../components/TeacherView/StudentsRow/StudentsRow';
import TeacherRow from '../components/TeacherView/TeacherRow/TeacherRow';
import YouAre from '../components/UI/YouAre/YouAre';
import './TeacherView.scss';

function TeacherView({
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
  const handleTeacherChange = useCallback(({ newData }) => {
    // setTeacherID(newData);
  }, []);

  const handleBeforeUnload = useCallback(() => {
    setTeacherId({ cell, teacherId: null });
  }, [cell]);

  const handleBecomeAStudent = useCallback(() => {
    setTeacherId({ cell, teacherId: null });
  }, [cell]);

  useEffect(() => {
    subscribeToTeacherUpdates({
      cell: cell,
      callback: handleTeacherChange,
    });
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cell, handleTeacherChange, handleBeforeUnload]);

  // data modifiers
  const studentsParticipantList = participantList.filter(
    (p) => p.id !== teacherId
  );
  const teacherParticipantId = teacherId
    ? participantList.find((p) => p.id === teacherId)
    : null;

  // assemble view
  const teacherRow = teacherParticipantId ? (
    <TeacherRow teacherParticipantId={teacherParticipantId} />
  ) : null;

  return (
    <div className="teacher-view">
      {/* absolute positioned */}
      <AudioVideoControls
        isUserVideoActive={isUserVideoActive}
        isUserAudioActive={isUserAudioActive}
        handleVideoButton={handleVideoActiveUpdate}
        handleAudioButton={handleAudioActiveUpdate}
      />

      <div className="teacher-view__top-controls">
        {/* <ScreenshareButton /> */}
        <YouAre role={'teacher'} />
        <SwapRolesButton handleSwap={handleBecomeAStudent} />
      </div>

      {/* in document flow */}
      <StudentsRow
        studentsParticipantList={studentsParticipantList}
        classRoom={classRoom}
        cell={cell}
      />
      {teacherRow}
    </div>
  );
}

export default TeacherView;
