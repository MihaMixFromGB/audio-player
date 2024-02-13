import { useState, useEffect } from "react";
import ButtonControl from "./ButtonControl";
import SoundTrack from "./SoundTrack";
import { useSoundState, play, pause, seek } from "./state";

const waveform = [
  0, 0, 0, 0, 0, 1, 31, 31, 31, 31, 30, 26, 31, 31, 31, 31, 31, 27, 11, 17, 17,
  16, 12, 9, 2, 0, 0, 0, 0, 3, 12, 12, 12, 12, 11, 10, 3, 0, 0, 4, 9, 10, 8, 6,
  8, 8, 6, 3, 5, 6, 4, 5, 4, 0, 5, 5, 5, 4, 1, 2, 2, 0, 3, 3, 3, 3, 5, 6, 5, 1,
  2, 2, 1, 1, 3, 5, 6, 6, 7, 7, 6, 3, 1, 0, 0, 0,
];
const duration = 72;
const linkMP3 =
  "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3";

const VoiceMessage = () => {
  const { currentInSec, status } = useSoundState({ src: linkMP3 });
  const [relativePos, setRelativePos] = useState(0.33);
  const [localCurrent, setLocalCurrent] = useState(24);
  const [isDrag, setDrag] = useState(false);

  const setPosition = (relativePos: number) => {
    const newLocalCurrent = Math.round(relativePos * duration);
    // console.log("!!! localCurrent", localCurrent);
    console.log("!!! newLocalCurrent", newLocalCurrent);
    if (localCurrent === newLocalCurrent) return;
    setLocalCurrent(newLocalCurrent);
    pause();
    seek(newLocalCurrent);
    setDrag(false);
    // setTimeout(() => {
    //   console.log("!!! setDrag -> timer");
    //   setDrag(false);
    // }, 2000);
  };

  const toggleStatus = () => {
    if (status === "stopped" || status === "paused") play(localCurrent);
    else if (status === "playing") pause();
  };

  useEffect(() => {
    if (isDrag) return;
    setLocalCurrent(currentInSec);
    setRelativePos(currentInSec / duration);
  }, [currentInSec]);

  return (
    <div className="voice-message">
      <ButtonControl status={status} onClick={toggleStatus} />
      <div className="voice-message__soundtrack">
        <SoundTrack
          waveform={waveform}
          relativePos={relativePos}
          setPosition={setPosition}
          setDrag={setDrag}
        />
        <div className="voice-message__time">
          <p>{formatTime(localCurrent)}</p>
          <p>{formatTime(duration)}</p>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number) {
  const totalSec = seconds % 60;
  const totalMin = (seconds - totalSec) / 60;
  return `${String(totalMin).padStart(2, "0")}:${String(totalSec).padStart(
    2,
    "0"
  )}`;
}

export default VoiceMessage;
