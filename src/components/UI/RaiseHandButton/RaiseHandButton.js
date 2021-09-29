// library
import React from 'react';
// internal
// components
import HandIcon from '../../assets/HandIcon';
// style
import './RaiseHandButton.scss';

export default function RaiseHandButton({ isRaised, onRaiseHand }) {
  const handleClick = () => {
    onRaiseHand();
  };

  return (
    <div
      className={`raise-hand-button ${isRaised ? 'is-raised' : ''}`}
      onClick={handleClick}
    >
      <HandIcon height={32} width={25} fill="white" />
      {isRaised ? 'Lower Hand' : 'Raise Hand'}
    </div>
  );
}
