import { useEffect } from 'react';
import { conference } from '@voxeet/voxeet-web-sdk';

// This hook clears out entries in Firebase for people
// who have exited the meeting.
// We use other strategies elsewhere in the code
// to trigger removal of user entries from Firebase.
// However, those strategies are unfortunately not 100% reliable,
// so this module was introduced to ensure that all "zombie"
// users that persist in Firebase after the actual user exits
// the app are eventually removed.

// We poll periodically to kill the zombies (in milliseconds).
const pollInterval = 5000;

export const useKillZombies = ({
  cell,
  teacherId,
  setTeacherId,
  classRoom,
  setUserIdInSeat,
}) => {
  useEffect(() => {
    // Check and rectify differences periodically, every `pollInterval` ms.
    const interval = setInterval(() => {
      // Wait until we have joined the conference.
      if (conference.participants) {
        // If there is a teacher set,
        if (teacherId) {
          // verify that the teacher is in the conference.
          const teacherParticipant = conference.participants.get(teacherId);

          // If not, remove them from the Firebase state.
          if (!teacherParticipant) setTeacherId(null);
        }

        // For each "student" we are tracking in Firebase,
        classRoom.forEach(({ participantId }, seat) => {
          // see if there is a corresponding participant in the Dolby.io conference.
          const participant = conference.participants.get(participantId);

          // If our Firebase entry is stale with respect to
          // the particimant inventory provided by Dolby APIs,
          if (!participant) {
            // remove it from Firebase.
            setUserIdInSeat({ cell, seat, userId: false });
          }
        });
      }
    }, pollInterval);
    return () => {
      clearInterval(interval);
    };
  }, [cell, teacherId, setTeacherId, classRoom, setUserIdInSeat]);
};
