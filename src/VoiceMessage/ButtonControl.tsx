import { SoundStatus } from "./state";

export interface ButtonControlProps {
  status: SoundStatus;
  onClick: () => void;
}
const ButtonControl = ({ status, onClick }: ButtonControlProps) => {
  return (
    <div className="voice-message__button wrapper">
      <button className="voice-message__button" onClick={onClick}>
        {(status === "stopped" || status === "paused") && (
          <i className="bx bx-md bx-play-circle"></i>
        )}
        {status === "playing" && <i className="bx bx-md bx-pause-circle"></i>}
      </button>
    </div>
  );
};

export default ButtonControl;
