// library
import React, { useState } from 'react';
// internal
// components
import './InfoRollover.scss';

export default function InfoRollover({ role }) {
  const [isOpen, setIsOpen] = useState(false);

  const studentInfo = (
    <ul className="info-rollover__list">
      <li>All students are muted by default</li>
      <li>Click the button to raise your hand</li>
      <li>
        Your teacher can call you on you, which will give you the permission to
        unmute for a period of time
      </li>
    </ul>
  );

  const teacherInfo = (
    <ul className="info-rollover__list">
      <li>
        All students are muted by default, but can raise their hands to indicate
        they’d like to speak.
      </li>
      <li>
        Call on a student by selecting their name or image. This will
        temporarily unmute them.
      </li>
      <li>As a teacher you can share your screen</li>
    </ul>
  );

  const infoContents = role === 'teacher' ? teacherInfo : studentInfo;

  return (
    <div className="info-rollover">
      <div
        className="info-rollover__icon"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        ?
      </div>
      <div
        className="info-rollover__info-panel"
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {infoContents}
      </div>
    </div>
  );
}
