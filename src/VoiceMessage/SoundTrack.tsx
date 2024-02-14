import { memo, useEffect, useMemo, useState } from "react";
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
export default memo(function SoundTrack({
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

    let n = "";
    for (let i = 0, r = 0; r < samples.length; r++) {
      i = Math.floor((samples[r] * maxHeight) / maxValue);
      if (i === 0) i = 0.5;
      n += "M" + (3 * r + padding) + "," + (maxHeight - i) + "v" + 2 * i + "Z";
    }
    return { path: n, width };
  }, [waveform]);

  let position = Math.ceil(relativePos * (width - 2 * padding));
  if (isNaN(position)) position = 0;

  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  api.set({ x: position });
  const [hoverTrCtrl, setHoverTrCtrl] = useState(false);
  // if (!hoverTrCtrl) api.set({ x: position });

  const bind = useGesture(
    {
      onDrag: ({ down, offset: [ox] }) => {
        console.log("!!! position", position);
        console.log("!!! ox", ox);
        api.start({ x: ox + position, immediate: down });
      },
      onDragEnd: ({ offset: [ox] }) => {
        const relativePosition = (ox + position) / (width - 2 * padding);
        setPosition(relativePosition);
        // api.set({ x: 0 });
        // api.stop(true);
      },
      onHover: ({ hovering }) => {
        setDrag(hovering ?? false);
        // setDrag(true);
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
          // x={position}
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
});
