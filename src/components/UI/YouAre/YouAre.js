// library
import React from 'react';
// internal
// components
import InfoRollover from './InfoRollover/InfoRollover';
import './YouAre.scss';

export default function YouAre({ role }) {
  let message;

  if (role === 'student') {
    message = (
      <span className="you-are__main-text">
        You are a <span className="you-are__role-text">Student</span>
      </span>
    );
  } else {
    message = (
      <span>
        You are the <span className="you-are__role-text"> Teacher </span>
      </span>
    );
  }

  return (
    <div className="you-are">
      <div className="you-are__message">{message}</div>
      <InfoRollover role={role} />
    </div>
  );
}
