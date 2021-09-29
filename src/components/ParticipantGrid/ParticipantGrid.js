// library
import React, { useRef, useCallback } from 'react';

import { session } from '@voxeet/voxeet-web-sdk';
// internal
import { setSeatCalledOn } from '../../utils/firebaseUtils';
// components
import ParticipantGridItem from './ParticipantGridItem/ParticipantGridItem';
//styles
import './ParticipantGrid.scss';

export default function ParticipantGrid({
  participantList,
  classRoom,
  isTeacher,
  cell,
}) {
  const ref = useRef();

  const handleClick = useCallback(
    (i) => {
      if (isTeacher) {
        const isSeatCalledOn = classRoom[i].isCalledOn;
        setSeatCalledOn({ cell, seat: i, isCalledOn: !isSeatCalledOn });
      }
    },
    [isTeacher, classRoom, cell]
  );

  // useEffect(() => {
  //   console.log({ participantList });
  //   return () => {};
  // }, [participantList]);

  // assemble view
  const items = participantList.map((el, i) => {
    return (
      <ParticipantGridItem
        participantInfo={el}
        key={`participant-${i}`}
        isHandRaised={classRoom ? classRoom[i]['isHandRaised'] : false}
        isCalledOn={classRoom[i].isCalledOn}
        handleClick={() => handleClick(i)}
        name={classRoom[i].name}
        isSelf={ el.id === session.participant.id} 
      />
    );
  });

  return (
    <div className="participant-grid" ref={ref} >
      {items}
    </div>
  );
}
