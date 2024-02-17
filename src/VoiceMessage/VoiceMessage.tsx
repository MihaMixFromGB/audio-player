import SoundTrack from "./SoundTrack";
import { VoiceMessageProvider } from "./state";
import ButtonControl from "./ButtonControl";
import TimeBar from "./TimeBar";

interface VoiceMessageProps {
  src: string;
  duration: number;
  waveform: number[];
}
const VoiceMessage = ({ src, duration, waveform }: VoiceMessageProps) => {
  return (
    <VoiceMessageProvider soundSrc={src}>
      <div className="voice-message">
        <ButtonControl />
        <div className="voice-message__soundtrack">
          <SoundTrack duration={duration} waveform={waveform} />
          <TimeBar duration={duration} />
        </div>
      </div>
    </VoiceMessageProvider>
  );
};

export default VoiceMessage;
