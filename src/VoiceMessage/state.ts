import { useState, useEffect } from "react";
import { Howl } from "howler";

export type SoundStatus = "playing" | "paused" | "stopped";
export type SoundState = {
  currentInSec: number;
  status: SoundStatus;
};

let sound: Howl | null = null;
let updTimer: ReturnType<typeof setInterval> | undefined = undefined;

export interface UseSoundProps {
  src: string;
}
export const useSoundState = ({ src }: UseSoundProps): SoundState => {
  const [currentInSec, setCurrentInSec] =
    useState<SoundState["currentInSec"]>(0);
  const [status, setStatus] = useState<SoundState["status"]>("stopped");

  useEffect(() => {
    sound = new Howl({ src });
    sound.on("play", () => {
      setStatus("playing");
      updTimer = setInterval(() => {
        const currentInSec = Math.round(sound?.seek() ?? 0);
        setCurrentInSec(currentInSec);
      }, 1000);
    });
    sound.on("pause", () => {
      clearInterval(updTimer);
      setStatus("paused");
    });
    sound.on("stop", () => {
      clearInterval(updTimer);
      setStatus("stopped");
      setCurrentInSec(0);
    });
    sound.on("end", () => {
      clearInterval(updTimer);
      setStatus("stopped");
      setCurrentInSec(0);
    });
  }, [src]);

  return { currentInSec, status };
};

export function play() {
  sound?.play();
}

export function pause() {
  sound?.pause();
}

export function seek(seconds: number) {
  sound?.pause();
  sound?.seek(seconds);
  sound?.play();
}
