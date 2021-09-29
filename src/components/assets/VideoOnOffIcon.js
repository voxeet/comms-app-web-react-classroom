// library
import React from 'react';
// internal
// components

export default function VideoOnOffIcon({ width, height, fill, isVideoOff }) {
  const style = {
    width: `${width}px`,
    height: `${height}px`,
  };
  const viewBox = `0 0 ${24} ${24}`;
  const classes = 'mx-2 flex-none';

  if (!isVideoOff) {
    return (
      <svg style={style} viewBox={viewBox} className={classes}>
        <path
          fill={fill}
          d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"
        />
      </svg>
    );
  } else {
    return (
      <svg style={style} viewBox={viewBox} className={classes}>
        <path
          fill={fill}
          d="M3.27,2L2,3.27L4.73,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16C16.2,18 16.39,17.92 16.54,17.82L19.73,21L21,19.73M21,6.5L17,10.5V7A1,1 0 0,0 16,6H9.82L21,17.18V6.5Z"
        />
      </svg>
    );
  }
}
