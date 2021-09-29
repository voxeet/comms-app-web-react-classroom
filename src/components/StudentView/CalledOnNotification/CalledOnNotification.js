// library
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
// import all of d3
import * as d3 from 'd3';
import _ from 'lodash';

// internal
import { getParticipantAudioLevel } from '../../../utils/voxeetUtils';
// components
// style
import './CalledOnNotification.scss';

export default function CalledOnNotification({
  isUserAudioActive,
  participantList,
}) {
  const ref = useRef();
  const AUDIO_CHECK_INTERVAL = 100;
  const [audioLevel, setAudioLevel] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const selfParticipant = useMemo(() => {
    return participantList.find((p) => p.isYou);
  }, [participantList]);

  const printAudioLevel = useCallback((v) => {
    setAudioLevel(v);
  }, []);

  const onResize = useCallback(() => {
    // const { svgHeight, svgWidth } = ref.current.getBoundingClientRect();
    const svgHeight =
      +d3.select(ref.current).style('height').replace('px', '') || 0;
    const svgWidth =
      +d3.select(ref.current).style('width').replace('px', '') || 0;
    setHeight(svgHeight);
    setWidth(svgWidth);
    // console.log({ svgHeight, svgWidth });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getParticipantAudioLevel(selfParticipant, printAudioLevel);
    }, AUDIO_CHECK_INTERVAL);
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearInterval(interval);
    };
  }, [selfParticipant, printAudioLevel, onResize]);

  const yScale = d3
    .scaleSqrt()
    .domain([0, 1])
    .range([0, height / 2]);
  const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);
  let audioPath = null;
  const valuesArray = _.range(101).map((i) => {
    if (i % 2 === 0) {
      return {
        x: i,
        y: audioLevel,
      };
    } else {
      return {
        x: i,
        y: -audioLevel,
      };
    }
  });
  audioPath = lineGenerator(valuesArray);

  const path = isUserAudioActive ? (
    <path d={audioPath} fill="none" stroke="yellowgreen" stroke-width="2" />
  ) : null;

  return (
    <div className="called-on-notification">
      <svg className="audio-svg" ref={ref}>
        <g
          style={{
            transform: `translate(${0}px,${height / 2}px)`,
          }}
        >
          {path}
        </g>
      </svg>
      <div className="called-on-notification__first">You’ve been called on</div>
      <div className="called-on-notification__second">
        hold the spacebar to talk
      </div>
    </div>
  );
}
