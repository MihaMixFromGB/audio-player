import { useTrack, useAppDispatch } from "../hooks";
import { play, pause } from "../store/actions";
import { SoundTrack } from "../store/model";

interface ButtonControlProps {
  trackId: SoundTrack["id"];
}
const ButtonControl = ({ trackId }: ButtonControlProps) => {
  const dispatch = useAppDispatch();
  const { status } = useTrack(trackId);

  function toggle() {
    if (status === "stopped" || status === "paused") {
      dispatch(play(trackId));
    } else if (status === "playing") {
      dispatch(pause());
    }
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
