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
  idx: number;
  src: string;
  sound?: Howl;
  status: AudioPlayerStatus;
  currentInSec: number;
};
export type AudioPlayerStatus = "playing" | "paused" | "stopped";
export type AudioPlayerState = {
  track: SoundTrack | null;
  playList: SoundTrack[];
  play: (idx?: number, seconds?: number) => void;
  pause: (idx?: number) => void;
  seek: (seconds: number) => void;
};

export const AudioPlayerContext = createContext<AudioPlayerState>(
  {} as AudioPlayerState
);

interface AudioPlayerProviderProps {
  playListSrc: Array<SoundTrack["src"]>;
  children: React.ReactNode;
}
const AudioPlayerProvider = ({
  playListSrc,
  children,
}: AudioPlayerProviderProps) => {
  const [playList] = useState<SoundTrack[]>(() =>
    playListSrc.map((src, idx) => ({
      idx,
      src,
      status: "stopped",
      currentInSec: 0,
    }))
  );
  const [track, setTrack] = useState<SoundTrack | null>(null);
  const updTimer = useRef<ReturnType<typeof setInterval> | undefined>();

  useEffect(() => {
    if (!track?.sound) return;
    const { sound } = track;

    sound.on("play", () => {
      updTimer.current = setInterval(() => {
        // console.log("!!! timer", Math.round(sound.seek() ?? 0));
        setTrack((t) => ({
          ...t!,
          status: "playing",
          currentInSec: Math.round(sound.seek() ?? 0),
        }));
      }, 1000);
    });
    sound.on("pause", () => {
      clearInterval(updTimer.current);
      setTrack((t) => ({
        ...t!,
        status: "paused",
      }));
    });
    sound.on("end", () => {
      clearInterval(updTimer.current);
      setTrack((t) => ({
        ...t!,
        status: "stopped",
      }));
    });

    sound.play();

    return () => {
      sound.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.idx]);

  function setNewTrack(idx: SoundTrack["idx"]) {
    console.log("!!! setNewTrack -> idx", idx);
    if (track) {
      console.log("!!! setNewTrack -> save track", track);
      playList[track.idx] = { ...track };
    }

    setTrack(playList[idx]);
  }

  const play = useCallback(
    (
      idx?: SoundTrack["idx"],
      seconds?: Parameters<AudioPlayerState["seek"]>[0]
    ) => {
      if (
        idx === undefined ||
        (track?.idx === idx && track?.status !== "playing")
      ) {
        if (seconds) track?.sound?.seek(seconds);
        track?.sound?.play();
        return;
      }

      if (!playList[idx]) return;
      if (!playList[idx].sound) {
        playList[idx].sound = new Howl({ src: playList[idx].src });
      }
      if (seconds) playList[idx].sound?.seek(seconds);

      setNewTrack(idx);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [track?.idx]
  );
  const pause = useCallback(
    () => {
      track?.sound?.pause();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [track?.idx]
  );
  const seek = useCallback(
    (seconds: Parameters<AudioPlayerState["seek"]>[0]) => {
      track?.sound?.seek(seconds);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [track?.idx]
  );

  const contextValue = useMemo(
    () => ({
      track,
      playList,
      play,
      pause,
      seek,
    }),
    [track, playList, play, pause, seek]
  );

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerProvider;
