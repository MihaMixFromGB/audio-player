import {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Howl } from "howler";

export type SoundTrack = {
  id: number;
  src: string;
  sound?: Howl;
};
export type AudioPlayerStatus = "playing" | "paused" | "stopped";
export type AudioPlayerState = {
  currentInSec: number;
  status: AudioPlayerStatus;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
};

export const AudioPlayerContext = createContext<AudioPlayerState>(
  {} as AudioPlayerState
);

interface AudioPlayerProviderProps {
  playList: SoundTrack[];
  children: React.ReactNode;
}
const AudioPlayerProvider = ({
  playList,
  children,
}: AudioPlayerProviderProps) => {
  const [track, setTrack] = useState<SoundTrack | null>(null);
  const [currentInSec, setCurrentInSec] = useState<number>(0);
  const updTimer = useRef<ReturnType<typeof setInterval> | undefined>();
  const [status, setStatus] = useState<AudioPlayerState["status"]>("stopped");

  useEffect(() => {
    if (!track?.sound) return;
    const { sound } = track;

    sound.on("play", () => {
      setStatus("playing");
      updTimer.current = setInterval(() => {
        setCurrentInSec(sound.seek() ?? 0);
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

    sound.play();

    return () => {
      sound.off();
    };
  }, [track]);

  const play = useCallback(
    (id?: SoundTrack["id"]) => {
      if (!id && !track) return;
      if ((!id && track) || track?.id === id) {
        track?.sound?.play();
      }

      const idx = playList.findIndex((t) => t.id === id);
      if (idx === -1) return;
      if (!playList[idx].sound) {
        playList[idx].sound = new Howl({ src: playList[idx].src });
      }
      setTrack(playList[idx]);
    },
    [track]
  );
  const pause = useCallback(() => {
    track?.sound?.pause();
  }, [track]);
  const seek = useCallback(
    (seconds: Parameters<AudioPlayerState["seek"]>[0]) => {
      track?.sound?.seek(seconds);
    },
    [track]
  );

  const contextValue = useMemo(
    () => ({ trackId: track?.id, currentInSec, status, play, pause, seek }),
    [track?.id, currentInSec, status, play, pause, seek]
  );

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerProvider;
