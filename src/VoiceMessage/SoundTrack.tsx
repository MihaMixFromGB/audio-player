import { useMemo, useState, useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

import { useAppDispatch, useTrack } from "../hooks";
import { play, seek, pause } from "../store/actions";
import { SoundTrack as TSoundTrack } from "../store/model";
import TimeBar from "./TimeBar";

export interface SoundTrackProps {
  trackId: TSoundTrack["id"];
}
const SoundTrack = ({ trackId }: SoundTrackProps) => {
  const maxValue = 100;
  const maxHeight = 100;
  const maxSamples = 100;
  const padding = 10;
  const hoverBorder = 6;

  const { id, currentInSec, status, duration, waveform } = useTrack(trackId);

  const { path, width, maxTrack, oxSec } = useMemo(() => {
    const samples =
      waveform.length > maxSamples ? resample(waveform, maxSamples) : waveform;
    const width = 3 * samples.length + 2 * padding;

    let n = "";
    for (let i = 0, r = 0; r < samples.length; r++) {
      i = Math.floor((samples[r] * maxHeight) / maxValue);
      if (i === 0) i = 0.5;
      n += "M" + (3 * r + padding) + "," + (maxHeight - i) + "v" + 2 * i + "Z";
    }

    const maxTrack = width - 2 * padding;
    return { path: n, width, maxTrack, oxSec: maxTrack / duration };
  }, [waveform, duration]);

  const dispatch = useAppDispatch();

  const position = useRef(0);
  // const timer = useRef<number | undefined>();

  position.current = currentInSec * oxSec;
  const [positionInSec, setPositionInSec] = useState(currentInSec);

  const [hoverTrCtrl, setHoverTrCtrl] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [skipStep, setSkipStep] = useState(false);

  const [{ x, filterX }, api] = useSpring(() => ({ x: 0, filterX: padding }));

  function getX(position: number) {
    if (position < 0) return 0;
    if (position > maxTrack) return maxTrack;
    return position;
  }

  function getPositionInSec(position: number) {
    const newCurrentInSec = Math.round(position / oxSec);
    if (newCurrentInSec < 0) return 0;
    else if (newCurrentInSec > duration) return duration;
    return newCurrentInSec;
  }

  useEffect(() => {
    if (dragging) {
      dispatch(pause());
      return;
    }
    if (skipStep) {
      if (status === "playing") setSkipStep(false);
      return;
    }

    position.current = currentInSec * oxSec;
    api.start({
      x: position.current,
      filterX: position.current + padding,
      config: { duration: 1000 },
    });
  }, [dispatch, currentInSec, status, dragging, skipStep, api, oxSec]);

  // useEffect(() => {
  //   if (dragging || position.current > maxTrack) {
  //     if (status === "playing") pause();
  //     clearInterval(timer.current);
  //     timer.current = undefined;
  //     return;
  //   }
  //   if (status !== "playing") return;
  //   console.log("!!! useEffect");
  //   timer.current = setInterval(() => {
  //     console.log("!!! timer");
  //     position.current = getX(position.current + oxSec);
  //     api.start({
  //       x: position.current,
  //       filterX: position.current + padding,
  //       config: { duration: 1000 },
  //     });
  //     if (position.current === maxTrack) clearInterval(timer.current);
  //   }, 1000);

  //   return () => {
  //     console.log("!!! exit useEffect");
  //     clearInterval(timer.current);
  //     timer.current = undefined;
  //   };
  // }, [api, dragging, duration, maxTrack, status]);

  const bind = useGesture({
    onDrag: ({ down, dragging, movement: [ox] }) => {
      setDragging(() => dragging ?? false);
      const newPosition = getX(position.current + ox);
      const newPositonInSec = getPositionInSec(newPosition);
      if (Math.abs(positionInSec - newPositonInSec) > 0.9) {
        setPositionInSec(newPositonInSec);
      }

      api.start({
        x: newPosition,
        filterX: newPosition + padding,
        immediate: down,
        reset: true, // <-- reset ox after every re-render of the component
        // TODO: return the drag -> bounds
      });
    },
    onDragEnd: async ({ movement: [ox] }) => {
      position.current += ox;
      setSkipStep(true);

      await dispatch(
        seek({
          trackId: id,
          currentInSec: getPositionInSec(position.current),
        })
      );
      dispatch(play(id));
    },
    onHover: ({ hovering }) => {
      setHoverTrCtrl(() => hovering ?? false);
    },
  });

  const AnimatedFeFlood = animated("feFlood");
  return (
    <div className="voice-message__soundtrack">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${width}px`}
        viewBox={`0 ${maxHeight / 2} ${width} ${maxHeight}`}
        fill="none"
      >
        <defs>
          <filter id={`glow${id}`}>
            <AnimatedFeFlood
              floodColor="#c0c0c0"
              floodOpacity="1"
              x={filterX}
              y={maxHeight / 2}
              height={maxHeight}
              width={maxTrack + padding}
              result="A"
            />
            <feComposite operator="in" in2="SourceGraphic" in="A" result="B" />
            <feColorMatrix type="hueRotate" in="B" result="C" values="90" />
            <feComposite operator="over" in2="SourceGraphic" in="C" />
          </filter>
        </defs>
        <path
          filter={`url(#glow${id})`}
          fillRule="evenodd"
          clipRule="evenodd"
          d={`${path}`}
          stroke="#4eac6d"
        ></path>
        <animated.g {...bind()} style={{ x, touchAction: "none" }}>
          <rect
            width="20"
            height={maxHeight}
            y={maxHeight / 2}
            stroke="none"
            fill="#fff"
            fillOpacity="0"
          ></rect>
          <line
            id="trCtrl"
            y2={(maxHeight * 3) / 2}
            x2={padding}
            y1={maxHeight / 2}
            x1={padding}
            stroke="#000"
            strokeWidth={hoverTrCtrl ? hoverBorder : 3}
            fill="none"
          />
        </animated.g>
      </svg>
      <TimeBar
        currentInSec={dragging ? positionInSec : currentInSec}
        duration={duration}
      />
    </div>
  );
};

function average(values: number[]) {
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length);
}

function resample(waveform: number[], maxLength: number) {
  const result = [];
  const count = Math.ceil(waveform.length / maxLength);

  for (let i = 0; i < maxLength; i++) {
    result.push(average(waveform.slice(count * i, count * (i + 1))));
  }

  return result;
}

export default SoundTrack;
