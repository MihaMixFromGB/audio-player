import SoundTrack from "./SoundTrack";
import ButtonControl from "./ButtonControl";
import TimeBar from "./TimeBar";
import { SoundTrackProps } from "./SoundTrack";

interface VoiceMessageProps extends SoundTrackProps {}

const VoiceMessage = ({ idx, duration, waveform }: VoiceMessageProps) => {
  return (
    <div className="voice-message">
      <ButtonControl idx={idx} />
      <div className="voice-message__soundtrack">
        <SoundTrack idx={idx} duration={duration} waveform={waveform} />
        <TimeBar idx={idx} duration={duration} />
      </div>
    </div>
  );
};

export default VoiceMessage;
