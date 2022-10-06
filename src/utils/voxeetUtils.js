import VoxeetSDK from '@voxeet/voxeet-web-sdk';

import {
  setupNewClassroomAtCell,
  getClassroomDataAtCell,
} from './firebaseUtils';

const token = prompt("Enter API Token Here:\nSee https://dashboard.dolby.io/ for help.")

const initializeSDK = (accessToken) => {
  const token = accessToken.split('.')[1];
  const jwt = JSON.parse(window.atob(token));
  let accessTokenExpiration = new Date(jwt.exp * 1000);
  if (accessTokenExpiration.getTime() <= new Date().getTime()) {
      alert('The access token you have provided has expired.');
      return;
  }

  console.group('Access Token');
  console.log(`\x1B[94mInitialize the SDK with the Access Token: \x1B[m${accessToken}`);
  console.log(`Access Token Expiration: ${accessTokenExpiration}`);
  console.groupEnd();

 VoxeetSDK.initializeToken(accessToken, () => new Promise((resolve) => resolve(accessToken)));
};

initializeSDK(token);

/**
 * This function either creates a new session if there isn't anyone in one with that alias
 * or finds the conference if there already is.
 * It returns an object that can be passed into joinConference below();
 * @param {*} alias
 * @returns conference
 */
const createConference = (alias) => {
  return new Promise((resolve, reject) => {
    VoxeetSDK.conference
      .create({ alias })
      .then((cellConference) => {
        resolve(cellConference);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

const getConference = () => {
  return VoxeetSDK.conference;
};

// conference in/out
const joinConference = async (conf) => {
  VoxeetSDK.conference.join(conf, {
    constraints: {
      audio: false,
      video: true,
    },
  });
  if (conf.isNew) {
    console.log('creating new conference');
    // load with blank classroom
    const classRoom = await setupNewClassroomAtCell({ cell: conf.alias });
    // return classroom object
    return classRoom;
  } else {
    console.log('joining existing conference');
    // return classroom object
    const classRoom = await getClassroomDataAtCell({ cell: conf.alias });
    return classRoom;
  }
};

const leaveConference = () => {
  VoxeetSDK.conference.leave();
};

// video
const startVideo = () => {
  VoxeetSDK.LocalVideo
    .start()
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

const stopVideo = () => {
  VoxeetSDK.LocalVideo
    .stop()
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

// audio
const startAudio = () => {
  VoxeetSDK.LocalAudio
    .start()
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

const stopAudio = () => {
  VoxeetSDK.LocalAudio
    .stop()
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

// media devices
const getAudioDevices = () => {
  return new Promise((resolve, reject) => {
    VoxeetSDK.mediaDevice
      .enumerateAudioInputDevices()
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getVideoDevices = () => {
  return new Promise((resolve, reject) => {
    VoxeetSDK.mediaDevice
      .enumerateVideoInputDevices()
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const changeAudioDevice = (deviceId) => {
  VoxeetSDK.mediaDevice
    .selectAudioInput(deviceId)
    .then(() => {})
    .catch((err) => console.error);
};

const changeVideoDevice = (deviceId) => {
  VoxeetSDK.mediaDevice
    .selectVideoInput(deviceId)
    .then(() => {})
    .catch((err) => console.error);
};

const startScreenShare = () => {
  VoxeetSDK.conference
    .startScreenShare()
    .then(() => {})
    .catch((e) => {});
};

const stopScreenShare = () => {
  VoxeetSDK.conference
    .stopScreenShare()
    .then(() => {})
    .catch((e) => {});
};

const getParticipantAudioLevel = (p, callback) => {
  VoxeetSDK.conference.audioLevel(p, callback);
};

export {
  createConference,
  joinConference,
  leaveConference,
  getConference,
  startVideo,
  stopVideo,
  startAudio,
  stopAudio,
  getAudioDevices,
  getVideoDevices,
  changeAudioDevice,
  changeVideoDevice,
  startScreenShare,
  stopScreenShare,
  getParticipantAudioLevel,
};
