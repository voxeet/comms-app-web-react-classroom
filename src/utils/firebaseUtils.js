import { db } from '../providers/Firebase';
import { blankClassroom } from './constants';

export const getFirebaseDataOnce = async ({ cell }) => {
  const ref = db.ref(cell);
  return (await ref.get()).val();
};

export const subscribeToTeacherUpdates = ({ cell, callback }) => {
  const ref = db.ref(`${cell}/teacherId`);
  ref.on('value', (snapshot) => {
    callback({ newData: snapshot.val() });
  });
};

export const subscribeToClassRoomUpdates = ({ cell, callback }) => {
  const ref = db.ref(`${cell}/classRoom`);
  ref.on('value', (snapshot) => {
    callback({ newData: snapshot.val() });
  });
};

export const setTeacherId = ({ cell, teacherId }) => {
  const ref = db.ref(`${cell}/teacherId`);
  return new Promise((resolve, reject) => {
    ref
      .set(teacherId, () => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const setupNewClassroomAtCell = async ({ cell }) => {
  const ref = db.ref(cell);
  await ref.set({
    classRoom: blankClassroom,
    isStudentFreeform: false,
  });
  return blankClassroom;
};

export const getClassroomDataAtCell = async ({ cell }) => {
  const ref = db.ref(`${cell}/classRoom`);
  const data = await ref.get();
  return data.val();
};

export const setUserIdInSeat = async ({ cell, seat, userId }) => {
  if (userId !== false) {
    const ref = db.ref(`${cell}/classRoom/${seat}/participantId`);
    await ref.set(userId);
  } else {
    const ref = db.ref(`${cell}/classRoom/${seat}`);
    const name = await (await ref.get()).val().name;
    await ref.set({
      participantId: false,
      isCalledOn: false,
      isHandRaised: false,
      name,
    });
  }
};

export const setUserHandRaised = async ({ cell, seat, isHandRaised }) => {
  const ref = db.ref(`${cell}/classRoom/${seat}/isHandRaised`);
  await ref.set(isHandRaised);
};

export const setSeatCalledOn = async ({ cell, seat, isCalledOn }) => {
  const ref = db.ref(`${cell}/classRoom/${seat}/isCalledOn`);
  await ref.set(isCalledOn);
};
