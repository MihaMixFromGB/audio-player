import { Howl } from "howler";
import { SoundTrack } from "../model";
import { UpdatePayload } from "./audioPlayerSlice";

export class AudioPlayer {
  private _timer: ReturnType<typeof setInterval> | undefined = undefined;
  private _sound: Howl | undefined;

  constructor(public track: SoundTrack | null) {}

  private _resetTimer() {
    clearInterval(this._timer);
    this._timer = undefined;
  }

  setTrack(track: SoundTrack) {
    this._sound?.off();
    this.track = track;

    this._sound = new Howl({ src: track.src });

    if (this.track.currentInSec) {
      this._sound.seek(this.track.currentInSec);
    }
  }

  play(cb: (args: UpdatePayload) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const sound = this._sound;
      if (!sound) {
        resolve();
        return;
      }

      sound.once("play", () => {
        this._timer = setInterval(() => {
          cb({
            id: this.track!.id,
            currentInSec: Math.round(sound.seek() ?? 0),
          });
        }, 1000);
        resolve();
      });
      sound.once("playerror", (_, msg) => {
        reject(`Audio player: ${msg}`);
      });
      sound.once("end", () => {
        this._resetTimer();
        cb({
          id: this.track!.id,
          status: "stopped",
        });
      });

      sound.play();
    });
  }

  seek(currentInSec: number): Promise<number> {
    return new Promise((resolve) => {
      const sound = this._sound;
      if (!sound) {
        resolve(0);
        return;
      }

      sound.once("seek", () => {
        const newCurrentInSec = Math.round(sound.seek() ?? 0);
        resolve(newCurrentInSec);
      });
      sound.seek(currentInSec);
    });
  }

  pause(): Promise<void> {
    return new Promise((resolve) => {
      const sound = this._sound;
      if (!sound) {
        resolve();
        return;
      }

      sound.once("pause", () => {
        this._resetTimer();
        resolve();
      });
      sound.pause();
    });
  }
}
