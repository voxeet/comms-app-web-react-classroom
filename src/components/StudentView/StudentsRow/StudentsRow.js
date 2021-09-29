// library
import React from 'react';
// internal
// components
import ParticipantGrid from '../../ParticipantGrid/ParticipantGrid';
// style
import './StudentsRow.scss';

export default function StudentsRow({ studentsParticipantList, classRoom }) {
  // const NUM_SEATS = 6;

  if (!classRoom) return null;

  // assemble data model
  const studentsRowItems = classRoom.map((el) => {
    if (el.participantId === false) {
      return {
        id: null,
        isVideo: false,
        isYou: false,
        name: el.name,
        participant: null,
        stream: null,
      };
    } else {
      // find that participant in the list
      const student = studentsParticipantList.find(
        (subEl) => subEl.id === el.participantId
      );
      if (student) {
        return student;
      } else {
        // there needs to be a participant of some sort
        // this only happens in an imediate change and normalizes once data catches up
        return {
          id: null,
          isVideo: false,
          isYou: false,
          name: '',
          participant: null,
          stream: null,
        };
      }
    }
  });

  return (
    <div className="students-row">
      <ParticipantGrid
        participantList={studentsRowItems}
        classRoom={classRoom}
        isTeacher={false}
      />
    </div>
  );
}
