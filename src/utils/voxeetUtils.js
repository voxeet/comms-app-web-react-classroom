import {
  initialize,
  session,
  conference,
  mediaDevice,
} from '@voxeet/voxeet-web-sdk';

import {
  setupNewClassroomAtCell,
  getClassroomDataAtCell,
} from './firebaseUtils';

// Enter your credentials from Dolby.io here:
// https://dolby.io/dashboard/applications/summary
const consumerKey = '<DOLBYIO_COMMUNICATIONS_API>';
const consumerSecret = '<DOLBYIO_COMMUNICATIONS_SECRET>';

initialize(consumerKey, consumerSecret);

/**
 * This function either creates a new session if there isn't anyone in one with that alias
 * or finds the conference if there already is.
 * It returns an object that can be passed into joinConference below();
 * @param {*} alias
 * @returns conference
 */
const createConference = (alias) => {
  return new Promise((resolve, reject) => {
    conference
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
  return conference;
};

// conference in/out
const joinConference = async (conf) => {
  conference.join(conf, {
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
  conference.leave();
};

// video
const startVideo = () => {
  conference
    .startVideo(session.participant)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

const stopVideo = () => {
  conference
    .stopVideo(session.participant)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

// audio
const startAudio = () => {
  conference
    .startAudio(session.participant)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

const stopAudio = () => {
  conference
    .stopAudio(session.participant)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

// media devices
const getAudioDevices = () => {
  return new Promise((resolve, reject) => {
    mediaDevice
      .enumerateAudioDevices()
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
    mediaDevice
      .enumerateVideoDevices()
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const changeAudioDevice = (deviceId) => {
  mediaDevice
    .selectAudioInput(deviceId)
    .then(() => {})
    .catch((err) => console.error);
};

const changeVideoDevice = (deviceId) => {
  mediaDevice
    .selectVideoInput(deviceId)
    .then(() => {})
    .catch((err) => console.error);
};

const startScreenShare = () => {
  conference
    .startScreenShare()
    .then(() => {})
    .catch((e) => {});
};

const stopScreenShare = () => {
  conference
    .stopScreenShare()
    .then(() => {})
    .catch((e) => {});
};

const getParticipantAudioLevel = (p, callback) => {
  conference.audioLevel(p, callback);
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
