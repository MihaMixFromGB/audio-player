import { useMemo, useState, useEffect, useRef } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

import { useSoundState } from "./state";

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

export interface SoundTrackProps {
  duration: number;
  waveform: number[];
}
export default function SoundTrack({ duration, waveform }: SoundTrackProps) {
  const maxValue = 100;
  const maxHeight = 100;
  const maxSamples = 100;
  const padding = 10;
  const hoverBorder = 6;

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
  }, [waveform]);

  //   const { status } = useSoundState();
  const [hoverTrCtrl, setHoverTrCtrl] = useState(false);
  const [dragging, setDragging] = useState(false);
  const timer = useRef<number | undefined>();
  // const [position, setPosition] = useState(0);
  const position = useRef(0);

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  function getX(value: number) {
    if (value < 0) return 0;
    if (value > maxTrack) return maxTrack;
    return value;
  }

  useEffect(() => {
    if (dragging || position.current > maxTrack) {
      clearInterval(timer.current);
      timer.current = undefined;
      return;
    }
    console.log("!!! useEffect");
    timer.current = setInterval(() => {
      console.log("!!! timer");
      position.current = getX(position.current + oxSec);
      api.start({
        x: position.current,
        config: { duration: 1000 },
      });
      if (position.current === maxTrack) clearInterval(timer.current);
    }, 1000);

    return () => {
      console.log("!!! exit useEffect");
      clearInterval(timer.current);
      timer.current = undefined;
    };
  }, [api, dragging, duration, maxTrack]);

  const bind = useGesture({
    onDrag: ({ down, dragging, movement: [ox] }) => {
      setDragging(() => dragging ?? false);
      console.log("!!! ox", ox);
      api.start({
        x: getX(position.current + ox),
        immediate: down,
        reset: true, // <-- reset ox after every re-render of the component
        // TODO: return the drag -> bounds
      });
    },
    onDragEnd: ({ movement: [ox] }) => {
      // setPosition((p) => getX(p + ox));
      position.current += ox;
    },
    onHover: ({ hovering }) => {
      setHoverTrCtrl(() => hovering ?? false);
    },
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${width}px`}
      viewBox={`0 ${maxHeight / 2} ${width} ${maxHeight}`}
      fill="none"
    >
      <path d={`${path}`} stroke="#4eac6d"></path>
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
  );
}
