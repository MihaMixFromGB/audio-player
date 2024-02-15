import { useMemo, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

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
  waveform: number[];
  relativePos: number;
  setPosition: (relativePos: number) => void;
}
export default function SoundTrack({
  waveform,
  relativePos,
  setPosition,
}: SoundTrackProps) {
  const maxValue = 100;
  const maxHeight = 100;
  const maxSamples = 100;
  const padding = 10;
  const hoverBorder = 3;

  const { path, width } = useMemo(() => {
    const samples =
      waveform.length > maxSamples ? resample(waveform, maxSamples) : waveform;
    const width = 3 * samples.length + 2 * padding;

    let n = "";
    for (let i = 0, r = 0; r < samples.length; r++) {
      i = Math.floor((samples[r] * maxHeight) / maxValue);
      if (i === 0) i = 0.5;
      n += "M" + (3 * r + padding) + "," + (maxHeight - i) + "v" + 2 * i + "Z";
    }
    return { path: n, width };
  }, [waveform]);
  const maxWidth = width - 2 * padding;

  let position = Math.ceil(relativePos * maxWidth);
  if (isNaN(position)) position = 0;

  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  api.set({ x: position });
  const [hoverTrCtrl, setHoverTrCtrl] = useState(false);

  function getX(value: number) {
    if (value < 0) return 0;
    if (value > maxWidth) return maxWidth;
    return value;
  }

  const bind = useGesture({
    onDrag: ({ down, movement: [mx] }) => {
      api.start({ x: getX(position + mx), immediate: down });
    },
    onDragEnd: ({ movement: [mx] }) => {
      const relativePosition = getX(mx + position) / (width - 2 * padding);
      setPosition(relativePosition);
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
          strokeWidth={hoverTrCtrl ? hoverBorder : 1}
          fill="none"
        />
      </animated.g>
    </svg>
  );
}
