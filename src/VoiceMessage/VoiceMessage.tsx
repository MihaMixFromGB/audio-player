import SoundTrack from "./SoundTrack";

export interface VoiceMessageProps {
  src: string;
  duration: number;
  waveform: number[];
}
const VoiceMessage = ({ src, duration, waveform }: VoiceMessageProps) => {
  return (
    <div>
      <p>{`src: ${src}`}</p>
      <p>{`duration: ${duration}`}</p>
      {/* <p>{waveform}</p> */}
      <SoundTrack duration={duration} waveform={waveform} />
    </div>
  );
};

export default VoiceMessage;
