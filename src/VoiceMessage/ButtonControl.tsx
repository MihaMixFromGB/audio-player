import { useSoundState } from "./state";

const ButtonControl = () => {
  const { status, play, pause } = useSoundState();
  function toggle() {
    if (status === "stopped" || status === "paused") play();
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
