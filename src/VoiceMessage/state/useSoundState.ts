import { useContext } from "react";
import { SoundContext } from "./Provider";

export const useSoundState = () => useContext(SoundContext);
