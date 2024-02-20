import { AudioPlayerProvider } from "./VoiceMessage/state";
import { VoiceMessage } from "./VoiceMessage";
import "./App.css";

const waveform = [
  0, 0, 0, 0, 0, 1, 31, 31, 31, 31, 30, 26, 31, 31, 31, 31, 31, 27, 11, 17, 17,
  16, 12, 9, 2, 0, 0, 0, 0, 3, 12, 12, 12, 12, 11, 10, 3, 0, 0, 4, 9, 10, 8, 6,
  8, 8, 6, 3, 5, 6, 4, 5, 4, 0, 5, 5, 5, 4, 1, 2, 2, 0, 3, 3, 3, 3, 5, 6, 5, 1,
  2, 2, 1, 1, 3, 5, 6, 6, 7, 7, 6, 3, 1, 0, 0, 0,
];
const duration = 72;

const playList = [
  "https://audio-ssl.itunes.apple.com/itunes-assets/Music/v4/a6/f4/ba/a6f4ba62-68f2-eac3-a813-b0626ef71df6/mzaf_1126527984189561509.plus.aac.p.m4a",
  "https://audio-ssl.itunes.apple.com/itunes-assets/Music4/v4/de/de/37/dede37ee-e3c9-d029-c02e-c8cf150b5548/mzaf_3092856567623581067.plus.aac.p.m4a",
];

function App() {
  return (
    <AudioPlayerProvider playListSrc={playList}>
      <VoiceMessage idx={0} duration={duration} waveform={waveform} />
      <VoiceMessage idx={1} duration={duration} waveform={waveform} />
    </AudioPlayerProvider>
  );
}

export default App;
