import {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Howl } from "howler";

export type SoundStatus = "playing" | "paused" | "stopped";
export type SoundState = {
  currentInSec: number;
  status: SoundStatus;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
};

export const SoundContext = createContext<SoundState>({} as SoundState);

interface VoiceMessageProviderProps {
  soundSrc: string;
  children: React.ReactNode;
}
const VoiceMessageProvider = ({
  soundSrc,
  children,
}: VoiceMessageProviderProps) => {
  const [sound] = useState<Howl>(() => new Howl({ src: soundSrc }));
  const updTimer = useRef<ReturnType<typeof setInterval> | undefined>();

  const [currentInSec, setCurrentInSec] =
    useState<SoundState["currentInSec"]>(0);
  const [status, setStatus] = useState<SoundState["status"]>("stopped");

  useEffect(() => {
    sound.on("play", () => {
      setStatus("playing");
      updTimer.current = setInterval(() => {
        const currentInSec = Math.round(sound?.seek() ?? 0);
        setCurrentInSec(currentInSec);
      }, 1000);
    });
    sound.on("pause", () => {
      clearInterval(updTimer.current);
      setStatus("paused");
    });
    sound.on("stop", () => {
      clearInterval(updTimer.current);
      setStatus("stopped");
      setCurrentInSec(0);
    });
    sound.on("end", () => {
      clearInterval(updTimer.current);
      setStatus("stopped");
    });
    return () => {
      sound.off();
    };
  }, [sound]);

  const play = useCallback(() => sound.play(), [sound]);
  const pause = useCallback(() => sound.pause(), [sound]);
  const seek = useCallback(
    (seconds: Parameters<SoundState["seek"]>[0]) => sound.seek(seconds),
    [sound]
  );

  const contextValue = useMemo(
    () => ({ currentInSec, status, play, pause, seek }),
    [currentInSec, status, play, pause, seek]
  );

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};

export default VoiceMessageProvider;
