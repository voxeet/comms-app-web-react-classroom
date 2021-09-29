// library
import React, { useCallback } from 'react';
// internal
// components

const styles = {
  container: `
    text-white
    flex flex-row
  `,
  text: `
    w-64
    font-extralight
  `,
  button: `
    bg-gradient-to-r from-dolby-gradient-stop-1 to-dolby-gradient-stop-2
    px-8 py-3
    rounded-lg
    cursor-pointer
  `,
};

export default function CallToActionButton() {
  const handleClick = useCallback(() => {
    window.open('https://dolby.io/', '_blank');
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        Feeling inspired? Customize your own Dolby.io meeting experience!
      </div>
      <div className={styles.button} onClick={handleClick}>
        Get Started
      </div>
    </div>
  );
}
