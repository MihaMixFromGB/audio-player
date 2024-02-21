import { useTrack } from "../hooks";
import { SoundTrack } from "../store/model";

interface TimeBarProps {
  trackId: SoundTrack["id"];
}
const TimeBar = ({ trackId }: TimeBarProps) => {
  const { currentInSec, duration } = useTrack(trackId);

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
