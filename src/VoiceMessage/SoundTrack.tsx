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
  setDrag: (state: boolean) => void;
}
export default function SoundTrack({
  waveform,
  relativePos,
  setPosition,
  setDrag,
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

    for (var n = "", i = 0, r = 0; r < samples.length; r++) {
      i = Math.floor((samples[r] * maxHeight) / maxValue);
      if (i === 0) i = 0.5;
      n += "M" + (3 * r + padding) + "," + (maxHeight - i) + "v" + 2 * i + "Z";
    }
    return { path: n, width };
  }, [waveform.length]);

  let position = Math.ceil(relativePos * (width - 2 * padding));
  if (isNaN(position)) position = 0;

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const [hoverTrCtrl, setHoverTrCtrl] = useState(false);
  const [offsetX, setOffsetX] = useState(0);

  const bind = useGesture(
    {
      onDrag: ({ down, offset: [ox] }) => {
        api.start({ x: ox, immediate: down });
      },
      onDragEnd: ({ offset: [ox] }) => {
        const relativePosition = (ox + position) / (width - 2 * padding);
        setPosition(relativePosition);
        setOffsetX(ox);
      },
      onHover: ({ hovering }) => {
        setDrag(hovering ?? false);
        setHoverTrCtrl(() => hovering ?? false);
      },
    },
    {
      drag: {
        axis: "x",
        bounds: {
          left: 0 - position,
          right: width - 2 * padding - position,
        },
      },
    }
  );

  console.log("!!! x ->", x.goal);
  console.log("!!! offsetX ->", offsetX);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${width}px`}
      viewBox={`0 ${maxHeight / 2} ${width} ${maxHeight}`}
      fill="none"
    >
      <path d={`${path}`} stroke="#4eac6d"></path>
      <animated.g {...bind()} style={{ x, y, touchAction: "none" }}>
        <rect
          width="20"
          height={maxHeight}
          x={position}
          y={maxHeight / 2}
          stroke="none"
          fill="#fff"
          fillOpacity="0"
        ></rect>
        <line
          id="trCtrl"
          y2={(maxHeight * 3) / 2}
          x2={position + padding}
          y1={maxHeight / 2}
          x1={position + padding}
          stroke="#000"
          strokeWidth={hoverTrCtrl ? hoverBorder : 1}
          fill="none"
        />
      </animated.g>
    </svg>
  );
}
