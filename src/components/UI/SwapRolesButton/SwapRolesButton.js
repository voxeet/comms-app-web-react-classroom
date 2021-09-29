// library
import React from 'react';
// internal
// components
import SwapIcon from '../../assets/SwapIcon';
// style
import './SwapRolesButton.scss';

export default function SwapRolesButton({ handleSwap }) {
  return (
    <div className="swap-roles-button" onClick={handleSwap}>
      <SwapIcon
        width={25}
        height={25}
        fill="black"
        additionalStyles={{ marginRight: '5px' }}
      />
      Swap Role
    </div>
  );
}
