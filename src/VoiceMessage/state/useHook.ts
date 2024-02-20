import { useContext } from "react";
import { AudioPlayerContext } from "./Provider";
import { SoundTrack } from "./Provider";

export const useTrack = (idx: SoundTrack["idx"]) => {
  const { track, playList } = useContext(AudioPlayerContext);
  return track?.idx === idx ? track : playList[idx];
};

export const useAudioPlayerControl = () => {
  const { play, pause } = useContext(AudioPlayerContext);
  return { play, pause };
};
