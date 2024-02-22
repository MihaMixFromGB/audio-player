import SoundTrack from "./SoundTrack";
import ButtonControl from "./ButtonControl";
import { SoundTrack as TSoundTrack } from "../store/model";

interface VoiceMessageProps {
  id: TSoundTrack["id"];
}

const VoiceMessage = ({ id }: VoiceMessageProps) => {
  return (
    <div className="voice-message">
      <ButtonControl trackId={id} />
      {/* <div className="voice-message__soundtrack"> */}
      <SoundTrack trackId={id} />
      {/* </div> */}
    </div>
  );
};

export default VoiceMessage;
