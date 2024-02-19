import { useContext } from "react";
import { AudioPlayerContext } from "./Provider";

export const useAudioPlayerState = () => useContext(AudioPlayerContext);
