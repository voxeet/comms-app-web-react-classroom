// library
import React, { useState, useCallback } from 'react';
// internal
import { startScreenShare, stopScreenShare } from '../../../utils/voxeetUtils';
// components
import ScreenshareIcon from '../../assets/ScreenshareIcon';
// style
import './ScreenshareButton.scss';

export default function ScreenshareButton() {
  // const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleClick = useCallback(() => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
    setIsScreenSharing(!isScreenSharing);
  }, [isScreenSharing]);

  const buttonText = isScreenSharing ? 'Stop Screen Share' : 'Share Screen';

  return (
    <div
      className={`screenshare-button ${isScreenSharing ? 'is-active' : ''}`}
      onClick={handleClick}
    >
      <ScreenshareIcon
        height={30}
        width={30}
        fill={'white'}
        isSharing={isScreenSharing}
        additionalStyles={{
          marginRight: '5px',
          paddingTop: '0.66em',
        }}
      />
      {buttonText}
    </div>
  );
}
