import { ApiVoiceMessage } from "./ApiVoiceMessage";

export type SoundTrack = ApiVoiceMessage & {
  id: number;
  currentInSec: number;
  status: SoundTrackStatus;
};

export type SoundTrackStatus = "playing" | "paused" | "stopped";
