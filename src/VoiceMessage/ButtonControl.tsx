import { useTrack, useAudioPlayerControl } from "./state";
import { SoundTrack } from "./state/Provider";

interface ButtonControlProps {
  idx: SoundTrack["idx"];
}
const ButtonControl = ({ idx }: ButtonControlProps) => {
  const { status } = useTrack(idx);
  const { play, pause } = useAudioPlayerControl();
  function toggle() {
    console.log("!!! status", status);
    if (status === "stopped" || status === "paused") play(idx);
    else if (status === "playing") pause();
  }

  return (
    <div className="voice-message__button wrapper">
      <button className="voice-message__button" onClick={toggle}>
        {(status === "stopped" || status === "paused") && (
          <i className="bx bx-md bx-play-circle"></i>
        )}
        {status === "playing" && <i className="bx bx-md bx-pause-circle"></i>}
      </button>
    </div>
  );
};

export default ButtonControl;
