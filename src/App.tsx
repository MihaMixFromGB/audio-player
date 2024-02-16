import { VoiceMessage } from "./VoiceMessage";
import "./App.css";

const waveform = [
  0, 0, 0, 0, 0, 1, 31, 31, 31, 31, 30, 26, 31, 31, 31, 31, 31, 27, 11, 17, 17,
  16, 12, 9, 2, 0, 0, 0, 0, 3, 12, 12, 12, 12, 11, 10, 3, 0, 0, 4, 9, 10, 8, 6,
  8, 8, 6, 3, 5, 6, 4, 5, 4, 0, 5, 5, 5, 4, 1, 2, 2, 0, 3, 3, 3, 3, 5, 6, 5, 1,
  2, 2, 1, 1, 3, 5, 6, 6, 7, 7, 6, 3, 1, 0, 0, 0,
];
const duration = 72;
const linkMP3 =
  "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3";

function App() {
  return <VoiceMessage src={linkMP3} duration={duration} waveform={waveform} />;
}

export default App;
