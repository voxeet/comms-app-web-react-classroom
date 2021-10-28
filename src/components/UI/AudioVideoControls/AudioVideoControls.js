// library
import React, { useState, useCallback } from 'react';
// internal
// components
import MicOnOffIcon from '../../assets/MicOnOffIcon';
import VideoOnOffIcon from '../../assets/VideoOnOffIcon';
import MediaDropdown from '../MediaSelectors/MediaDropdown.js';
import SettingsIcon from '../../assets/SettingsIcon.js';
import LinkIcon from '../../assets/LinkIcon.js';
// style
import '../MediaSelectors/MediaSelectors.scss';
import './AudioVideoControls.scss';

export default function AudioVideoControls({
  isUserVideoActive,
  isUserAudioActive,
  handleVideoButton,
  handleAudioButton,
  hideMuteButton,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleClick = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const handleLinkShareClick = useCallback(() => {
    // Copy the URL to the clipboard.
    // See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        // Copy the link to the parent page if we are in a parent page.
        // Otherwise, if we are in a standalone page,
        // copy the URL of this page.
        const { href } = window.location;
        const url = new URL(href);
        const parentURL = url.searchParams.get('parentURL');
        const newClip = parentURL || href;

        navigator.clipboard.writeText(newClip).then(
          () => {
            setIsLinkCopied(true);
            setTimeout(() => {
              setIsLinkCopied(false);
            }, 2000);
          },
          () => {
            console.log('Failed to copy - error in writeText');
          }
        );
      } else {
        console.log('Failed to copy - permission denied');
      }
    });
  }, []);

  const menu = isMenuOpen ? (
    <div className="media-selectors__menu">
      <MediaDropdown type={'audio'} />
      <MediaDropdown type={'video'} />
    </div>
  ) : null;

  const clickTarget = isMenuOpen ? (
    <div
      className="media-selectors__click-target"
      onClick={() => setIsMenuOpen(false)}
    ></div>
  ) : null;

  const mediaSelectors = (
    <div className="media-selectors">
      <div
        className="audio-video-controls__button"
        onClick={handleLinkShareClick}
      >
        <LinkIcon
          width={24}
          height={24}
          fill={isLinkCopied ? 'rgba(80, 176, 108, 1)' : 'white'}
        />
      </div>
      <div
        className="link-copied-tooltip"
        style={{ opacity: isLinkCopied ? 1 : 0 }}
      >
        Location URL Copied to Clipboard
      </div>
      <div className="audio-video-controls__button" onClick={handleClick}>
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
  const audioButton = !hideMuteButton ? (
    <div
      className={`audio-video-controls__button ${
        !isUserAudioActive ? '' : 'is-active'
      }`}
      onClick={() => handleAudioButton(!isUserAudioActive)}
    >
      <MicOnOffIcon
        width={30}
        height={30}
        fill={'white'}
        isAudioOff={!isUserAudioActive}
      />
    </div>
  ) : null;

  const videoButton = (
    <div
      className={`audio-video-controls__button ${
        !isUserVideoActive ? '' : 'is-active'
      }`}
      onClick={() => handleVideoButton(!isUserVideoActive)}
    >
      <VideoOnOffIcon
        width={34}
        height={34}
        fill={'white'}
        isVideoOff={!isUserVideoActive}
      />
    </div>
  );

  return (
    <div className="audio-video-controls">
      {audioButton}
      {videoButton}
      {mediaSelectors}
    </div>
  );
}
