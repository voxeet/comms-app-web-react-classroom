import { useState, useEffect } from 'react';
import { session } from '@voxeet/voxeet-web-sdk';

const name = 'Test User';

export const VoxeetSessionProvider = ({ children }) => {
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    // how can I tell if a session is opened?
    session.open({ name }).then(() => {
      setIsSessionLoaded(true);
    });
  }, []);

  return isSessionLoaded ? children : <div>Loading session...</div>;
};
