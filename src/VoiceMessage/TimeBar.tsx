import { useSoundState } from "./state";

interface TimeBarProps {
  duration: number;
}
const TimeBar = ({ duration }: TimeBarProps) => {
  const { currentInSec } = useSoundState();

  return (
    <div className="voice-message__time">
      <p>{formatTime(currentInSec)}</p>
      <p>{formatTime(duration)}</p>
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

export default TimeBar;
