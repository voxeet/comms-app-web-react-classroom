// library
import React, { useState, useCallback } from 'react';
// internal
// components
import MediaDropdown from './MediaDropdown.js';
import SettingsIcon from '../../assets/SettingsIcon.js';
// style
import './MediaSelectors.scss';

export default function MediaSelectors() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const menu = isMenuOpen ? (
    <div className="media-selectors__menu">
      <MediaDropdown type={'audio'} />
      <MediaDropdown type={'video'} />
    </div>
  ) : null;

  const clickTarget = isMenuOpen ? (
    <div
      class="media-selectors__click-target"
      onClick={() => setIsMenuOpen(false)}
    ></div>
  ) : null;

  return (
    <div className="media-selectors">
      <div className="media-selectors__icon" onClick={handleClick}>
        <SettingsIcon
          width={24}
          height={24}
          fill={isMenuOpen ? 'rgba(80, 176, 108, 1)' : 'white'}
        />
      </div>
      {clickTarget}
      {menu}
    </div>
  );
}
