// library
import React from 'react';
// internal
// components
// style
import './SeatSelection.scss';

export default function SeatSelection({
  classRoom,
  teacherId,
  selectionHandler,
  teacherSelectionHandler,
}) {
  //event handler
  const handleClick = (index, isTaken) => {
    if (!isTaken) {
      selectionHandler({ seat: index });
    }
  };

  const handleTeacherClick = (teacherId) => {
    if (!teacherId) {
      teacherSelectionHandler();
    }
  };

  // view assembly
  const seats = classRoom.map((el, i) => {
    const isTaken = el.participantId !== false;
    const stateClass = isTaken ? 'is-taken' : 'is-available';
    return (
      <div
        key={`seat-${i}`}
        className={`seat-selectors__selector ${stateClass}`}
        onClick={() => handleClick(i, isTaken)}
      >
        {`${el.name}`}
      </div>
    );
  });

  const teacherSelector = (
    <div
      className={`seat-selectors__selector ${
        teacherId ? 'is-taken' : 'is-available'
      }`}
      onClick={() => handleTeacherClick(teacherId)}
    >
      Teacher
    </div>
  );

  return (
    <div className="seat-selection">
      <div className="seat-selection__overlay">
        <div className="seat-selection__content">
          <div className="seat-selection__instructions">
            <h1>Select Your Role</h1>
            <p>
              Choose a role to demonstrate the classroom experience. If option
              is greyed out, another user has already selected that role.
            </p>
          </div>

          <div className="seat-selectors">
            <div className="seat-selectors__left">
              <div className="seat-selectors__section-instructions">
                <h2>Teacher</h2>
                <p>Screenshare & control audio permissions for students</p>
              </div>
              <div className="seat-selectors__teacher-grid">
                {teacherSelector}
              </div>
            </div>
            <div className="seat-selectors__right">
              <div className="seat-selectors__section-instructions">
                <h2>Students</h2>
                <p>Raise hand & push-to-talk when called upon</p>
              </div>
              <div className="seat-selectors__seat-grid">{seats}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
